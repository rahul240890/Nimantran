"use client";

import { Bell, SlidersHorizontal, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { uiStrings } from "@/lib/ui-strings";
import { Section, Specimen } from "./layout";

function AddGuestDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [tried, setTried] = useState(false);
  const error = tried && !name.trim() ? "Enter the guest's name." : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setName("");
          setTried(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button leadingIcon={<UserPlus aria-hidden />}>Add a guest</Button>
      </DialogTrigger>
      <DialogContent
        title="Add a guest"
        description="They'll get their own RSVP link."
        closeLabel={uiStrings.close}
        footer={
          <>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                setTried(true);
                if (!name.trim()) return;
                setOpen(false);
                toast({
                  tone: "success",
                  title: `${name.trim()} added`,
                  description: "Their RSVP link is ready to share.",
                });
                setName("");
                setTried(false);
              }}
            >
              Add guest
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <Field label="Name" error={error} required>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="off"
            />
          </Field>
          <Field label="Side">
            <Select
              options={[
                { value: "bride", label: "Bride's side" },
                { value: "groom", label: "Groom's side" },
                { value: "both", label: "Both" },
              ]}
              defaultValue="both"
            />
          </Field>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterSheet({ side }: { side: "bottom" | "end" }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" leadingIcon={<SlidersHorizontal aria-hidden />}>
          {side === "bottom" ? "Bottom sheet" : "Side panel"}
        </Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        title="Filter guests"
        description="Show only the guests you need."
        closeLabel={uiStrings.close}
        footer={
          <Button
            fullWidth
            className="sm:w-auto"
            onClick={() => toast({ title: "Filters applied" })}
          >
            Show 86 guests
          </Button>
        }
      >
        <div className="flex flex-col divide-y divide-line">
          <Switch label="Attending" defaultChecked />
          <Switch label="Not replied yet" defaultChecked />
          <Switch label="Declined" />
          <Switch label="Needs a room" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Overlays() {
  return (
    <Section
      id="overlays"
      eyebrow="06 · Overlays"
      title="Dialogs, sheets and toasts"
      intro="Overlays rise in over a soft blur. Focus moves inside, Escape closes, and focus returns to the button that opened them."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Dialog and sheets" note="Try submitting the dialog empty">
          <div className="flex flex-wrap gap-3">
            <AddGuestDialog />
            <FilterSheet side="bottom" />
            <FilterSheet side="end" />
          </div>
        </Specimen>
        <Specimen title="Toasts" note="Swipe down or press Escape to dismiss">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  tone: "success",
                  title: "Invite published",
                  description: "Your link is ready to share on WhatsApp.",
                })
              }
            >
              Success
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  tone: "error",
                  title: "Couldn't save your changes",
                  description: "Check your connection. Your edits are kept on this phone.",
                  action: {
                    label: "Try again",
                    altText: "Try saving again",
                    onClick: () => toast({ tone: "success", title: "Saved" }),
                  },
                })
              }
            >
              Error with action
            </Button>
            <Button
              variant="secondary"
              leadingIcon={<Bell aria-hidden />}
              onClick={() =>
                toast({
                  tone: "info",
                  title: "Meera's family replied",
                  description: "4 attending the sangeet.",
                })
              }
            >
              Info
            </Button>
            <Button variant="ghost" onClick={() => toast({ title: "Link copied" })}>
              Plain
            </Button>
          </div>
        </Specimen>
      </div>
    </Section>
  );
}
