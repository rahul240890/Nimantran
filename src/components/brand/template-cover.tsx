import { templates, type TemplateId } from "@/content/landing";
import { cn } from "@/lib/cn";
import { Mandala } from "./mandala";

const s = templates.sample;

/* Every cover uses container units, so it scales with the card it sits in */

function MarigoldGate() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-card-ivory text-center text-card-ink">
      <span className="absolute inset-[4%] rounded-[4px] border-2 border-card-gold" />
      <span className="absolute inset-[6.5%] rounded-[2px] border border-card-gold/60" />
      <Mandala className="absolute top-[9%] left-1/2 w-[30%] -translate-x-1/2 text-card-gold" />
      <span className="relative mt-[30%] font-label text-[4cqw] tracking-[0.3em] text-card-gold-text">
        SHUBH VIVAH
      </span>
      <span className="relative mt-[4%] font-display text-[12cqw] leading-none">{s.first}</span>
      <span className="relative font-display text-[7cqw] leading-none text-card-accent-text">
        &amp;
      </span>
      <span className="relative font-display text-[12cqw] leading-none">{s.second}</span>
      <span className="relative mt-[6%] font-label text-[4.2cqw] tracking-[0.14em]">{s.date}</span>
    </div>
  );
}

function RoseGarden() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-tpl-rose-paper text-center text-tpl-rose-ink">
      {/* Rose buds climbing the corners */}
      {["top-[-6%] left-[-6%]", "right-[-6%] bottom-[-6%] rotate-180"].map((pos) => (
        <svg
          key={pos}
          viewBox="0 0 100 100"
          className={cn("absolute w-[46%] text-tpl-rose-ornament", pos)}
        >
          {[
            [30, 30, 13],
            [58, 20, 9],
            [20, 60, 9],
            [52, 50, 6],
          ].map(([cx, cy, r]) => (
            <g key={`${cx}-${cy}`} fill="currentColor">
              <circle cx={cx} cy={cy} r={r} fillOpacity="0.85" />
              <circle
                cx={cx}
                cy={cy}
                r={r! * 0.55}
                fill="var(--tpl-rose-paper)"
                fillOpacity="0.35"
              />
            </g>
          ))}
          <path
            d="M8 88C30 70 44 44 86 12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeOpacity="0.6"
          />
        </svg>
      ))}
      <span className="relative font-label text-[4cqw] tracking-[0.3em] text-tpl-rose-accent">
        WITH LOVE
      </span>
      <span className="relative mt-[5%] font-display text-[13cqw] leading-none italic">
        {s.first}
      </span>
      <span className="relative my-[2%] font-display text-[6cqw] leading-none text-tpl-rose-accent">
        and
      </span>
      <span className="relative font-display text-[13cqw] leading-none italic">{s.second}</span>
      <span className="relative mt-[7%] text-[4.4cqw]">{s.date}</span>
    </div>
  );
}

function EmeraldPalace() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-end bg-tpl-emerald-paper pb-[14%] text-center text-tpl-emerald-ink">
      {/* A palace arch framing the names */}
      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
        className="absolute inset-[7%] h-[86%] w-[86%] text-tpl-emerald-ornament"
      >
        <path
          d="M4 123V48C4 22 26 6 50 2C74 6 96 22 96 48V123"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M10 123V50C10 28 30 13 50 9C70 13 90 28 90 50V123"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeOpacity="0.7"
        />
      </svg>
      <Mandala
        simple
        className="absolute top-[15%] left-1/2 w-[18%] -translate-x-1/2 text-tpl-emerald-ornament"
      />
      <span className="relative font-label text-[4cqw] tracking-[0.3em] text-tpl-emerald-accent">
        THE WEDDING OF
      </span>
      <span className="relative mt-[5%] font-display text-[12.5cqw] leading-none">{s.first}</span>
      <span className="relative font-display text-[6cqw] leading-none text-tpl-emerald-accent">
        &amp;
      </span>
      <span className="relative font-display text-[12.5cqw] leading-none">{s.second}</span>
      <span className="relative mt-[6%] font-label text-[4cqw] tracking-[0.16em] text-tpl-emerald-accent">
        {s.place.toUpperCase()}
      </span>
    </div>
  );
}

function RoyalScroll() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-tpl-scroll-paper px-[12%] text-center text-tpl-scroll-ink">
      {/* Wooden rods at the top and bottom of the scroll */}
      {["top-[3%]", "bottom-[3%]"].map((pos) => (
        <span
          key={pos}
          className={cn("absolute inset-x-[3%] h-[5%] rounded-full bg-tpl-scroll-ornament", pos)}
        >
          <span className="absolute inset-x-[6%] top-[25%] h-[20%] rounded-full bg-tpl-scroll-paper/30" />
        </span>
      ))}
      <span className="absolute inset-x-[8%] top-[8%] bottom-[8%] border-x border-tpl-scroll-ornament/40" />
      <span className="relative font-label text-[4cqw] tracking-[0.3em] text-tpl-scroll-accent">
        SHRI GANESHAYA NAMAH
      </span>
      <span className="relative mt-[8%] font-display text-[12cqw] leading-none">{s.first}</span>
      <span className="relative font-display text-[6cqw] leading-none text-tpl-scroll-accent">
        weds
      </span>
      <span className="relative font-display text-[12cqw] leading-none">{s.second}</span>
      <span className="relative mt-[8%] h-px w-[40%] bg-tpl-scroll-ornament/60" />
      <span className="relative mt-[5%] text-[4.4cqw] italic">{s.date}</span>
    </div>
  );
}

function MinimalMonogram() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-tpl-monogram-paper text-center text-tpl-monogram-ink">
      <span className="absolute inset-[7%] border border-tpl-monogram-ornament" />
      <span className="relative flex items-center gap-[4cqw] font-display text-[22cqw] leading-none">
        {s.first.charAt(0)}
        <span className="h-[22cqw] w-px bg-tpl-monogram-ornament" />
        {s.second.charAt(0)}
      </span>
      <span className="relative mt-[10%] font-label text-[4.2cqw] tracking-[0.34em]">
        {`${s.first} & ${s.second}`.toUpperCase()}
      </span>
      <span className="relative mt-[4%] text-[4.2cqw] text-tpl-monogram-accent">{s.date}</span>
    </div>
  );
}

function KeralaKasavu() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-tpl-kasavu-paper text-center text-tpl-kasavu-ink">
      {/* The gold kasavu border of a Kerala saree, woven along both edges */}
      {["top-[6%]", "bottom-[6%]"].map((pos) => (
        <span
          key={pos}
          className={cn("absolute inset-x-0 flex h-[7%] flex-col justify-between", pos)}
        >
          <span className="h-[18%] bg-tpl-kasavu-ornament" />
          <span
            className="h-[34%]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, var(--tpl-kasavu-ornament) 0 6px, transparent 6px 10px)",
            }}
          />
          <span className="h-[18%] bg-tpl-kasavu-ornament" />
        </span>
      ))}
      <span className="relative font-label text-[4cqw] tracking-[0.3em] text-tpl-kasavu-accent">
        KALYANAM
      </span>
      <span className="relative mt-[6%] font-display text-[12cqw] leading-none">{s.first}</span>
      <span className="relative font-display text-[6cqw] leading-none text-tpl-kasavu-accent">
        &amp;
      </span>
      <span className="relative font-display text-[12cqw] leading-none">{s.second}</span>
      <span className="relative mt-[7%] font-label text-[4cqw] tracking-[0.14em]">{s.date}</span>
    </div>
  );
}

const covers: Record<TemplateId, () => React.JSX.Element> = {
  marigold: MarigoldGate,
  rose: RoseGarden,
  emerald: EmeraldPalace,
  scroll: RoyalScroll,
  monogram: MinimalMonogram,
  kasavu: KeralaKasavu,
};

/** A flat preview of a launch design, drawn on its own card stock. Decorative: name it nearby. */
export function TemplateCover({ id, className }: { id: TemplateId; className?: string }) {
  const Cover = covers[id];
  return (
    <div
      aria-hidden
      className={cn(
        "[container-type:inline-size] relative aspect-[4/5] w-full overflow-hidden rounded-md shadow-float",
        className,
      )}
    >
      <Cover />
    </div>
  );
}
