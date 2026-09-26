import { writeFileSync } from "node:fs";
import { seedSql } from "../src/lib/db/seed";

// Rewrites supabase/seed.sql from the catalogues: npm run db:seed
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), seedSql());
console.log("Wrote supabase/seed.sql");
