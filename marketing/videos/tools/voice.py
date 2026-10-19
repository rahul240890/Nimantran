# Speaks every ad line in voice/lines.json with Kokoro (Apache-2.0) into
# public/voice/<ad>-<lang>-<n>.wav, and writes src/voice.json with each line's length so
# captions and scenes follow the voice. Usage: python3 tools/voice.py [ad ...]
# Needs: pip install kokoro-onnx, and in tools/kokoro/ (or $KOKORO_DIR) model.onnx plus
# af_heart.bin and hf_beta.bin from huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX
# (onnx/model_quantized.onnx and voices/*.bin).
import json, os, sys, unicodedata, wave
from pathlib import Path
import numpy as np
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
KOKORO = Path(os.environ.get("KOKORO_DIR", ROOT / "tools/kokoro"))
VOICES = {"en": ("af_heart", "en-us", 1.0), "hi": ("hf_beta", "hi", 0.95)}
# Where Kokoro's voices say a sound wrongly, the phonemes it should say instead
FIX = {"en-us": {"sˈændʒiːt": "sˈʌŋɡiːt"}, "hi": {"kˈaːɾɖ": "kˈaːɾɖə", "lˈĩk": "lˈɪŋk"}}


def phonemes(text, code):
    if code == "hi":
        # The Hindi voice mangles nukta sounds (फ़, ज़); plain letters come out closer
        text = unicodedata.normalize("NFD", text).replace("\u093c", "")
    ph = unicodedata.normalize("NFC", k.tokenizer.phonemize(text, code))
    for wrong, right in FIX[code].items():
        ph = ph.replace(unicodedata.normalize("NFC", wrong), right)
    return ph


lines = json.loads((ROOT / "voice/lines.json").read_text())
only = sys.argv[1:]
# Kokoro reads its voices from one .npz; pack the single-voice files into it once
pack = KOKORO / "voices.bin"
if not pack.exists():
    voices = {name: np.fromfile(KOKORO / f"{name}.bin", dtype=np.float32).reshape(-1, 1, 256) for name, _, _ in VOICES.values()}
    with open(pack, "wb") as f:
        np.savez(f, **voices)
k = Kokoro(str(KOKORO / "model.onnx"), str(pack))
out = ROOT / "public/voice"
out.mkdir(parents=True, exist_ok=True)
manifest_path = ROOT / "src/voice.json"
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
for ad, langs in lines.items():
    if only and ad not in only:
        continue
    for lang, texts in langs.items():
        voice, code, speed = VOICES[lang]
        entries = []
        for i, text in enumerate(texts):
            samples, rate = k.create(phonemes(text, code), voice=voice, speed=speed, lang=code, is_phonemes=True)
            # Trim leading and trailing near-silence, keep 60 ms of air
            loud = np.where(np.abs(samples) > 0.01)[0]
            if len(loud):
                pad = int(rate * 0.06)
                samples = samples[max(0, loud[0] - pad): loud[-1] + pad]
            name = f"{ad}-{lang}-{i}.wav"
            pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
            with wave.open(str(out / name), "wb") as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm.tobytes())
            entries.append({"file": f"voice/{name}", "text": text, "seconds": round(len(samples) / rate, 3)})
            print(ad, lang, i, entries[-1]["seconds"])
        manifest.setdefault(ad, {})[lang] = entries
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
