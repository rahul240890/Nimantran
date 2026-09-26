"use client";

import { CircleHelp, HeartHandshake, X } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Section, Specimen, StateLabel } from "./layout";

const functions = ["Haldi", "Mehendi", "Sangeet"];

export function Choices() {
  const [picked, setPicked] = useState<string[]>(["Haldi"]);
  const all = picked.length === functions.length;
  const some = picked.length > 0 && !all;

  return (
    <Section
      id="choices"
      eyebrow="04 · Choices"
      title="Checkboxes, radios and switches"
      intro="Small controls get a full 44px row to tap. Ticks draw themselves in and dots spring into place."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Specimen title="Checkbox">
          <Checkbox
            label="All functions"
            checked={all ? true : some ? "indeterminate" : false}
            onCheckedChange={(value) => setPicked(value === true ? functions : [])}
          />
          <div className="ms-8 flex flex-col">
            {functions.map((name) => (
              <Checkbox
                key={name}
                label={name}
                checked={picked.includes(name)}
                onCheckedChange={(value) =>
                  setPicked((current) =>
                    value === true ? [...current, name] : current.filter((item) => item !== name),
                  )
                }
              />
            ))}
          </div>
          <div className="mt-3 border-t border-line pt-3">
            <Checkbox
              label="I agree to the terms"
              description="Required before publishing."
              invalid
            />
            <Checkbox label="Send reminders by SMS" description="Coming later." disabled />
          </div>
        </Specimen>

        <Specimen title="Radio group">
          <StateLabel>Guests per invite</StateLabel>
          <RadioGroup label="Guests per invite" defaultValue="family">
            <RadioItem value="single" label="Just the guest" />
            <RadioItem value="couple" label="Guest and partner" />
            <RadioItem
              value="family"
              label="Whole family"
              description="Guests say how many are coming."
            />
            <RadioItem value="custom" label="Set per guest" disabled />
          </RadioGroup>
        </Specimen>

        <Specimen title="Switch">
          <div className="flex flex-col divide-y divide-line">
            <Switch label="Background music" defaultChecked />
            <Switch label="Falling petals" description="Turns off on slow phones." />
            <Switch label="Show guest count" defaultChecked disabled />
            <Switch label="Hide RSVP" disabled />
          </div>
        </Specimen>
      </div>

      <Specimen title="Choice cards" note="Big, friendly choices such as the guest RSVP">
        <StateLabel>Will you attend the wedding?</StateLabel>
        <RadioGroup label="Will you attend the wedding?" variant="card" defaultValue="yes">
          <RadioItem
            value="yes"
            icon={<HeartHandshake />}
            label="Joyfully accept"
            description="We'll ask how many are coming."
          />
          <RadioItem
            value="maybe"
            icon={<CircleHelp />}
            label="Not sure yet"
            description="We'll remind you nearer the day."
          />
          <RadioItem
            value="no"
            icon={<X />}
            label="Regretfully decline"
            description="Send the couple your blessings."
          />
        </RadioGroup>
      </Specimen>
    </Section>
  );
}
