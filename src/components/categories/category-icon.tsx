import {
  CalendarHeart,
  Flame,
  Flower2,
  Gem,
  Hand,
  HeartHandshake,
  Music,
  PartyPopper,
  Sun,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { CategoryIcon as IconId } from "@/lib/categories/schema";

const ICONS: Record<IconId, LucideIcon> = {
  ring: HeartHandshake,
  gem: Gem,
  turmeric: Sun,
  henna: Hand,
  music: Music,
  flame: Flame,
  celebrate: PartyPopper,
  calendar: CalendarHeart,
  diya: Flame,
  flower: Flower2,
};

/** A category's icon. Categories name their icon as data; this draws it. */
export function CategoryIcon({ icon, ...props }: LucideProps & { icon: IconId }) {
  const Icon = ICONS[icon];
  return <Icon aria-hidden {...props} />;
}
