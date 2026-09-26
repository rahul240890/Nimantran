import { UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

const sizes = { sm: "size-8 [&_svg]:size-4", lg: "size-16 [&_svg]:size-7" } as const;

/** The signed-in person's picture or initials, or a person outline before they add a name. */
export function PersonAvatar({
  name,
  src,
  size,
  label,
}: {
  name: string;
  src?: string | null;
  size: keyof typeof sizes;
  /** Read out when there is no name to read. */
  label: string;
}) {
  if (name.trim() || src)
    return <Avatar name={name || label} src={src ?? undefined} size={size} ring />;
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-marigold/20 text-accent-text ring-2 ring-marigold ring-offset-2 ring-offset-paper",
        sizes[size],
      )}
    >
      <UserRound aria-hidden />
      <span className="sr-only">{label}</span>
    </span>
  );
}
