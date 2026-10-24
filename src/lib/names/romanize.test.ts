import { describe, expect, it } from "vitest";
import { romanize } from "./romanize";

describe("romanize", () => {
  it("writes Hindi and Marathi names as families spell them", () => {
    expect(romanize("राहुल")).toBe("rahul");
    expect(romanize("प्रिया")).toBe("priya");
    expect(romanize("आरव")).toBe("aarav");
    expect(romanize("मीरा")).toBe("meera");
    expect(romanize("कृष्ण")).toBe("krishna");
    expect(romanize("लक्ष्मी")).toBe("lakshmi");
    expect(romanize("दीपक")).toBe("deepak");
    expect(romanize("पूजा")).toBe("pooja");
    expect(romanize("राजू")).toBe("raju");
    expect(romanize("अमित शर्मा")).toBe("amit sharma");
  });

  it("drops the silent 'a' at a name's end and inside it, but not after a nasal or cluster", () => {
    expect(romanize("हरजीत")).toBe("harjeet");
    expect(romanize("दिनकर")).toBe("dinkar");
    expect(romanize("अंजलि")).toBe("anjali");
    expect(romanize("निर्मला")).toBe("nirmala");
    expect(romanize("नमन")).toBe("naman");
    expect(romanize("संभव")).toBe("sambhav");
    expect(romanize("चंदन")).toBe("chandan");
    expect(romanize("मिश्र")).toBe("mishra");
    expect(romanize("सत्य")).toBe("satya");
    expect(romanize("सिद्धार्थ")).toBe("siddharth");
    expect(romanize("हर्ष")).toBe("harsh");
  });

  it("reads dotted letters and ज्ञ", () => {
    expect(romanize("ज़ैनब")).toBe("zainab");
    expect(romanize("फ़ातिमा")).toBe("fatima");
    expect(romanize("ज्ञान")).toBe("gyan");
  });

  it("writes Gujarati, Bengali and Punjabi names", () => {
    expect(romanize("રાહુલ")).toBe("rahul");
    expect(romanize("હેતલ")).toBe("hetal");
    expect(romanize("রাহুল")).toBe("rahul");
    expect(romanize("লক্ষ্মী")).toBe("lakshmi");
    expect(romanize("জয়")).toBe("jay");
    expect(romanize("শ্রেয়া")).toBe("shreya");
    expect(romanize("ਗੁਰਪ੍ਰੀਤ")).toBe("gurpreet");
    expect(romanize("ਸਿੱਧੂ")).toBe("siddhu");
  });

  it("writes Tamil names as Tamil families do, and the other southern scripts", () => {
    expect(romanize("செந்தில்")).toBe("senthil");
    expect(romanize("சரவணன்")).toBe("saravanan");
    expect(romanize("முத்து")).toBe("muthu");
    expect(romanize("கார்த்திக்")).toBe("karthik");
    expect(romanize("மீனா")).toBe("meena");
    expect(romanize("రమేష్")).toBe("ramesh");
    expect(romanize("ಸುರೇಶ್")).toBe("suresh");
    expect(romanize("ലക്ഷ്മി")).toBe("lakshmi");
  });

  it("leaves English letters and everything else as they are", () => {
    expect(romanize("Rahul & प्रिया")).toBe("Rahul & priya");
    expect(romanize("Zoë")).toBe("Zoë");
    expect(romanize("")).toBe("");
  });
});
