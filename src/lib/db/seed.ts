import { CATEGORIES, CATEGORY_IDS } from "@/lib/categories/catalog";
import { TEMPLATES } from "@/lib/templates/catalog";
import { TEMPLATE_IDS } from "@/lib/templates/schema";

/*
 * supabase/seed.sql, written from the category and design catalogues so the database
 * and the code never disagree. `npm run db:seed` rewrites the file; a unit test fails
 * when it is out of date. Upserts, so it can run again on a live database.
 */

const text = (value: string) => `'${value.replace(/'/g, "''")}'`;
const json = (value: unknown) => `${text(JSON.stringify(value))}::jsonb`;
const array = (values: readonly (string | number)[], type: "text" | "smallint") =>
  `array[${values.map((value) => (typeof value === "number" ? String(value) : text(value))).join(", ")}]::${type}[]`;

export function seedSql(): string {
  const lines = [
    "-- Written by `npm run db:seed` from src/lib/categories and src/lib/templates.",
    "-- Do not edit by hand: change the catalogues, then run the script again.",
    "",
    "insert into public.templates (id, name, data, position) values",
    TEMPLATE_IDS.map((id, index) => {
      const template = TEMPLATES[id];
      return `  (${text(id)}, ${text(template.name)}, ${json(template)}, ${index})`;
    }).join(",\n"),
    "on conflict (id) do update set name = excluded.name, data = excluded.data, position = excluded.position;",
    "",
    'insert into public.categories (id, "group", names, icon, priority, season, regions, functions, schedule, rsvp_questions, wording, position) values',
    CATEGORY_IDS.map((id, index) => {
      const c = CATEGORIES[id];
      return `  (${[
        text(c.id),
        text(c.group),
        json(c.names),
        text(c.icon),
        String(c.priority),
        array(c.season, "smallint"),
        array(c.regions, "text"),
        json(c.functions),
        text(c.schedule),
        array(c.rsvpQuestions, "text"),
        json(c.wording),
        String(index),
      ].join(", ")})`;
    }).join(",\n"),
    'on conflict (id) do update set "group" = excluded."group", names = excluded.names, icon = excluded.icon,',
    "  priority = excluded.priority, season = excluded.season, regions = excluded.regions,",
    "  functions = excluded.functions, schedule = excluded.schedule,",
    "  rsvp_questions = excluded.rsvp_questions, wording = excluded.wording, position = excluded.position;",
    "",
    "delete from public.category_templates;",
    "insert into public.category_templates (category_id, template_id, position) values",
    CATEGORY_IDS.flatMap((id) =>
      CATEGORIES[id].templates.map(
        (templateId, index) => `  (${text(id)}, ${text(templateId)}, ${index})`,
      ),
    ).join(",\n") + ";",
    "",
  ];
  return lines.join("\n");
}
