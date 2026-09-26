"use client";

import { ArrowLeft, ArrowRight, Flower2, Music, Sparkles, Sun, Utensils } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Section, Specimen } from "./layout";

const functions = [
  {
    id: "haldi",
    label: "Haldi",
    icon: Sun,
    when: "Thursday, 10 December · 10:00 AM",
    where: "Family home, Udaipur",
  },
  {
    id: "mehendi",
    label: "Mehendi",
    icon: Flower2,
    when: "Thursday, 10 December · 4:00 PM",
    where: "Courtyard, Pichola Lakeside Gardens",
  },
  {
    id: "sangeet",
    label: "Sangeet",
    icon: Music,
    when: "Friday, 11 December · 7:30 PM",
    where: "Lakeside lawns",
  },
  {
    id: "wedding",
    label: "Wedding",
    icon: Sparkles,
    when: "Saturday, 12 December · 7:15 PM",
    where: "Mandap by the lake",
  },
  {
    id: "reception",
    label: "Reception",
    icon: Utensils,
    when: "Sunday, 13 December · 8:00 PM",
    where: "Grand ballroom",
  },
];

const steps = [
  { id: "design", label: "Choose design" },
  { id: "couple", label: "Couple details" },
  { id: "functions", label: "Functions" },
  { id: "media", label: "Photos and music" },
  { id: "preview", label: "Preview" },
];

export function Navigation() {
  const [current, setCurrent] = useState(1);

  return (
    <Section
      id="navigation"
      eyebrow="07 · Navigation"
      title="Tabs and stepper"
      intro="Tabs switch between the wedding functions; a raised pill slides to the one you pick. The stepper shows hosts where they are in the editor."
    >
      <Specimen title="Tabs" note="Arrow keys move between tabs; the row scrolls on phones">
        <Tabs defaultValue="sangeet">
          <TabsList aria-label="Wedding functions">
            {functions.map(({ id, label, icon: Icon }) => (
              <TabsTrigger key={id} value={id}>
                <Icon aria-hidden />
                {label}
              </TabsTrigger>
            ))}
            <TabsTrigger value="after-party" disabled>
              After-party
            </TabsTrigger>
          </TabsList>
          {functions.map((item) => (
            <TabsContent key={item.id} value={item.id}>
              <div className="flex flex-col gap-1 rounded-lg border border-line bg-surface p-5">
                <p className="font-display text-2xl">{item.label}</p>
                <p className="text-ink">{item.when}</p>
                <p className="text-ink-muted">{item.where}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Specimen>

      <Specimen title="Stepper" note="Phones show the current step and a progress bar">
        <div className="flex flex-col gap-6">
          <Stepper
            steps={steps}
            current={current}
            label="Invite progress"
            progressText={`Step ${current + 1} of ${steps.length}`}
            doneLabel="done"
          />
          <div className="flex justify-between gap-3">
            <Button
              variant="secondary"
              leadingIcon={<ArrowLeft aria-hidden className="rtl:rotate-180" />}
              disabled={current === 0}
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
            >
              Back
            </Button>
            <Button
              trailingIcon={<ArrowRight aria-hidden className="rtl:rotate-180" />}
              disabled={current === steps.length - 1}
              onClick={() => setCurrent((value) => Math.min(steps.length - 1, value + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </Specimen>
    </Section>
  );
}
