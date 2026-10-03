import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { AdminHeading } from "@/components/admin/admin-shell";
import { TestAi } from "@/components/admin/ai-controls";
import { SettingRow } from "@/components/admin/setting-row";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/access";
import { AI_PROVIDERS, aiConfig } from "@/lib/wording/providers";

export const metadata: Metadata = { title: "AI" };

const NAMES = {
  anthropic: "Claude (Anthropic)",
  gemini: "Gemini (Google)",
  openai: "ChatGPT (OpenAI)",
  deepseek: "DeepSeek",
} as const;

const WHERE_TO_GET = [
  ["gemini", "aistudio.google.com → Get API key"],
  ["openai", "platform.openai.com → API keys"],
  ["deepseek", "platform.deepseek.com → API keys"],
  ["anthropic", "console.anthropic.com → API keys"],
] as const;

const masked = (value: string) => (value.length <= 4 ? "••••" : `••••${value.slice(-4)}`);

/** Which AI writes the card wording and blog drafts, read from Vercel, and a test. */
export default async function AiPage() {
  await requireAdmin("/admin/ai");
  const config = aiConfig();
  const named = process.env.AI_PROVIDER?.trim();
  const unknown =
    Boolean(named) && !(AI_PROVIDERS as readonly string[]).includes(named!.toLowerCase());
  const set = (label = "Set") => ({ tone: "success" as const, label });
  const missing = { tone: "warning" as const, label: "Not set" };

  return (
    <>
      <AdminHeading
        eyebrow="Settings"
        title="AI"
        intro="One AI writes the wording on hosts' cards (Write with AI in the editor) and first drafts of blog posts. Its key lives in Vercel's environment variables, never in the database; this page only shows the last four characters."
      />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles aria-hidden className="size-5 text-accent-text" />
              {config ? NAMES[config.provider] : "AI is off"}
            </CardTitle>
            <CardDescription>
              Read from Vercel on every request. After changing a value there, redeploy for it to
              take effect.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col divide-y divide-line">
              <SettingRow
                name="Provider"
                where="AI_PROVIDER: gemini, openai, deepseek or anthropic"
                value={named || undefined}
                state={
                  unknown
                    ? { tone: "danger", label: "Not a provider we know" }
                    : config
                      ? set(NAMES[config.provider])
                      : missing
                }
              />
              <SettingRow
                name="Key"
                where="AI_API_KEY (or ANTHROPIC_API_KEY for Claude)"
                value={config ? masked(config.apiKey) : undefined}
                state={config ? set() : missing}
              />
              <SettingRow
                name="Model"
                where="AI_MODEL, optional: a model name from the provider's console"
                value={config?.model}
                state={
                  process.env.AI_MODEL?.trim()
                    ? set()
                    : { tone: "neutral" as const, label: config ? "Default" : "Not set" }
                }
              />
            </div>
            <TestAi disabled={!config} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Where to get a key</CardTitle>
            <CardDescription>
              Gemini is a good start: it writes Hindi and the regional languages well and costs
              little.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-[auto_1fr]">
              {WHERE_TO_GET.map(([id, where]) => (
                <div key={id} className="contents">
                  <dt className="font-semibold">{NAMES[id]}</dt>
                  <dd className="text-ink-muted">
                    {where}, then set <code className="font-mono text-sm">AI_PROVIDER={id}</code>
                  </dd>
                </div>
              ))}
            </dl>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
