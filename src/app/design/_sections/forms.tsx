"use client";

import { Mail, Phone, Search } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CharacterCount, Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { Section, Specimen } from "./layout";

const dressCodes = [
  { value: "traditional", label: "Traditional" },
  { value: "indo-western", label: "Indo-western" },
  { value: "pastels", label: "Pastels" },
  { value: "white-gold", label: "White and gold" },
  { value: "black-tie", label: "Black tie", disabled: true },
];

const MESSAGE_MAX = 160;

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function Forms() {
  const [message, setMessage] = useState(
    "With joy in our hearts, we invite you to bless the couple.",
  );
  const [phone, setPhone] = useState("98765");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>("19:30");
  const [today] = useState(startOfToday);

  const phoneError =
    phone.replace(/\D/g, "").length === 10 ? undefined : "Enter a 10-digit mobile number.";

  return (
    <Section
      id="fields"
      eyebrow="03 · Forms"
      title="Text fields, lists, date and time"
      intro="Labels always sit above the field. Hints turn into errors in place, so the layout never jumps and screen readers hear the message."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Specimen title="Text input">
          <div className="flex flex-col gap-5">
            <Field label="Bride's name" hint="As it should appear on the invite." required>
              <Input placeholder="Meera Iyer" autoComplete="off" />
            </Field>
            <Field label="Email" optionalLabel="Optional">
              <Input type="email" leading={<Mail />} defaultValue="meera@example.com" />
            </Field>
            <Field label="Mobile number" error={phoneError} required>
              <Input
                type="tel"
                inputMode="numeric"
                leading={<Phone />}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </Field>
            <Field label="Invite link" hint="Set when you publish." disabled>
              <Input defaultValue="nimantran.app/i/aarav-weds-meera" />
            </Field>
            <Field label="Event code">
              <Input readOnly defaultValue="NIM-4821" />
            </Field>
            <Input
              aria-label="Search guests"
              type="search"
              placeholder="Search guests"
              leading={<Search />}
            />
          </div>
        </Specimen>

        <div className="flex flex-col gap-6">
          <Specimen title="Textarea">
            <Field
              label="Message to guests"
              hint="Grows as you type."
              aside={
                <CharacterCount
                  value={message.length}
                  max={MESSAGE_MAX}
                  label={`${message.length} of ${MESSAGE_MAX} characters used`}
                />
              }
            >
              <Textarea
                value={message}
                maxLength={MESSAGE_MAX}
                onChange={(event) => setMessage(event.target.value)}
              />
            </Field>
          </Specimen>

          <Specimen title="Select">
            <div className="flex flex-col gap-5">
              <Field label="Dress code">
                <Select options={dressCodes} placeholder="Choose a dress code" />
              </Field>
              <Field label="Meal preference" error="Choose a meal so the caterer can plan.">
                <Select
                  options={[
                    { value: "veg", label: "Vegetarian" },
                    { value: "jain", label: "Jain" },
                    { value: "non-veg", label: "Non-vegetarian" },
                  ]}
                  placeholder="Choose a meal"
                />
              </Field>
              <Field label="Language" disabled>
                <Select options={[{ value: "en", label: "English" }]} defaultValue="en" />
              </Field>
            </div>
          </Specimen>
        </div>
      </div>

      <Specimen
        title="Date and time pickers"
        note="Arrow keys move by day, Page Up and Down by month"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Wedding date" hint="Past dates are unavailable." required>
            <DatePicker
              value={date}
              onValueChange={setDate}
              placeholder="Pick a date"
              disabledDays={{ before: today }}
              startMonth={today}
            />
          </Field>
          <Field label="Muhurat time" hint="In 15-minute steps.">
            <TimePicker value={time} onValueChange={setTime} placeholder="Pick a time" />
          </Field>
          <Field label="Reception date" error="The reception can't be before the wedding.">
            <DatePicker value={new Date(2026, 11, 11)} placeholder="Pick a date" />
          </Field>
          <Field label="Haldi time" disabled>
            <TimePicker defaultValue="10:00" placeholder="Pick a time" />
          </Field>
        </div>
      </Specimen>
    </Section>
  );
}
