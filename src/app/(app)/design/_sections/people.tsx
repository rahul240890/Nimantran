import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Section, Specimen, StateLabel } from "./layout";

const badges: { tone: BadgeTone; label: string }[] = [
  { tone: "neutral", label: "Draft" },
  { tone: "gold", label: "Premium" },
  { tone: "success", label: "Attending" },
  { tone: "warning", label: "Awaiting reply" },
  { tone: "danger", label: "Declined" },
  { tone: "rose", label: "Bride's side" },
];

const guests = [
  "Aarav Sharma",
  "Meera Iyer",
  "Kabir Singh",
  "Ananya Rao",
  "Farhan Qureshi",
  "Lakshmi Nair",
];

export function People() {
  return (
    <Section
      id="status"
      eyebrow="08 · Status and people"
      title="Badges and avatars"
      intro="Badges always say their status in words; colour is never the only signal. Avatars fall back to initials on a tint picked from the name."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Badges">
          <StateLabel>Plain</StateLabel>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.tone} tone={badge.tone}>
                {badge.label}
              </Badge>
            ))}
          </div>
          <div className="mt-5">
            <StateLabel>With status dot</StateLabel>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <Badge key={badge.tone} tone={badge.tone} dot>
                  {badge.label}
                </Badge>
              ))}
            </div>
          </div>
        </Specimen>
        <Specimen title="Avatars">
          <div className="flex flex-col gap-5">
            <div>
              <StateLabel>Sizes, photo and initials</StateLabel>
              <div className="flex flex-wrap items-center gap-4">
                <Avatar name="Aarav Sharma" size="sm" />
                <Avatar name="Meera Iyer" src="/design/avatar-sample.svg" />
                <Avatar name="Kabir Singh" size="lg" />
                <Avatar name="अनन्या राव" size="xl" ring />
              </div>
            </div>
            <div>
              <StateLabel>Group</StateLabel>
              <AvatarGroup more={{ count: 12, label: "and 12 more guests" }}>
                {guests.slice(0, 5).map((name) => (
                  <Avatar key={name} name={name} />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </Specimen>
      </div>
    </Section>
  );
}
