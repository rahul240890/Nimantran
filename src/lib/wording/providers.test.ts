import { describe, expect, it } from "vitest";
import { aiConfig, chatAnswer, chatRequest } from "./providers";

describe("AI provider", () => {
  it("is off without a key, and Claude with only the old key", () => {
    expect(aiConfig({})).toBeNull();
    expect(aiConfig({ AI_PROVIDER: "gemini" })).toBeNull();
    expect(aiConfig({ ANTHROPIC_API_KEY: "a" })).toMatchObject({ provider: "anthropic" });
  });

  it("follows AI_PROVIDER, with the model from AI_MODEL when set", () => {
    expect(aiConfig({ AI_PROVIDER: "Gemini", AI_API_KEY: "g" })).toMatchObject({
      provider: "gemini",
      apiKey: "g",
    });
    expect(
      aiConfig({ AI_PROVIDER: "deepseek", AI_API_KEY: "d", AI_MODEL: "deepseek-reasoner" }),
    ).toEqual({ provider: "deepseek", apiKey: "d", model: "deepseek-reasoner" });
  });

  it("asks an OpenAI-style API for JSON", () => {
    const { url, init } = chatRequest(
      { provider: "openai", apiKey: "k", model: "m" },
      "system",
      "prompt",
    );
    expect(url).toBe("https://api.openai.com/v1/chat/completions");
    expect(init.headers.authorization).toBe("Bearer k");
    const body = JSON.parse(init.body) as { response_format: unknown; messages: unknown[] };
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages).toHaveLength(2);
  });

  it("reads the wording out of the reply, fenced or not, and rejects anything else", () => {
    const pages = { pages: [{ id: "cover", lines: [{ style: "large", text: "Aarav & Meera" }] }] };
    const reply = (content: string) => ({ choices: [{ message: { content } }] });
    expect(chatAnswer(reply(JSON.stringify(pages)))).toEqual(pages);
    expect(chatAnswer(reply("```json\n" + JSON.stringify(pages) + "\n```"))).toEqual(pages);
    expect(chatAnswer(reply("Sorry, I can't"))).toBeNull();
    expect(chatAnswer({ error: "quota" })).toBeNull();
  });
});
