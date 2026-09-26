import { GateCardPreview } from "@/components/brand/gate-card-preview";
import { Logo } from "@/components/brand/logo";
import { site } from "@/lib/site";

const promises = [
  {
    title: "One link, opens anywhere",
    body: "Guests tap it in WhatsApp and the card opens in 3D. No app to install.",
  },
  {
    title: "RSVP in one tap",
    body: "See who is coming, how many, and who still hasn't replied.",
  },
  {
    title: "In your language",
    body: "Hindi, Tamil, Marathi, Bengali and six more at launch, with English alongside.",
  },
];

export default function HomePage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-x-clip">
      {/* Warm glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-20%] -z-10 size-[44rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--marigold) 28%, transparent), transparent)",
        }}
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <Logo />
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-sm text-ink-muted">
          <span aria-hidden className="size-2 rounded-full bg-marigold" />
          In development
        </span>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-7">
          <p className="font-label text-xs tracking-[0.28em] text-accent-text uppercase">
            Shubh aarambh · coming soon
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4.25rem]">
            Invitations your guests open, turn and keep.
          </h1>
          <p className="max-w-[34rem] text-lg text-ink-muted sm:text-xl">{site.description}</p>

          <dl className="mt-2 grid gap-5 border-t border-line pt-7 sm:grid-cols-3 sm:gap-6">
            {promises.map((item) => (
              <div key={item.title} className="flex flex-col gap-1.5">
                <dt className="font-semibold text-ink">{item.title}</dt>
                <dd className="text-[0.95rem] leading-relaxed text-ink-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <GateCardPreview />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 {site.name}. Made in India.</p>
          <p>3D invitations · RSVP · 10 Indian languages</p>
        </div>
      </footer>
    </div>
  );
}
