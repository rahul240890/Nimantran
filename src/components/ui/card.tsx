import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CardProps = ComponentProps<"div"> & {
  /** flat: a bordered panel. raised: sits a little above the page. interactive: lifts on hover. */
  elevation?: "flat" | "raised" | "interactive";
};

export function Card({ elevation = "raised", className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative flex min-w-0 flex-col rounded-lg border border-line bg-surface text-ink",
        elevation === "raised" && "shadow-raised",
        elevation === "interactive" &&
          "shadow-raised transition-[transform,box-shadow,border-color] duration-300 ease-out-expo hover:-translate-y-1 hover:border-line-strong hover:shadow-float has-focus-visible:-translate-y-1 has-focus-visible:shadow-float has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-ring motion-still:hover:translate-y-0",
        className,
      )}
      {...props}
    />
  );
}

/* For an interactive card, make the title a link with after:absolute after:inset-0 so the whole card is the target */

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-1.5 p-5 pb-0 sm:p-6 sm:pb-0", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 className={cn("font-display text-xl leading-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-ink-muted", className)} {...props} />;
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-4 p-5 sm:p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-6",
        className,
      )}
      {...props}
    />
  );
}
