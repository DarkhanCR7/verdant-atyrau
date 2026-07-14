import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check your .env file (see .env.example).");
}

const isNeon = connectionString.includes("neon.tech");

/**
 * Neon-hosted databases are reached over HTTP (port 443) via their serverless
 * driver instead of the raw Postgres wire protocol (port 5432). Some
 * networks (corporate Wi-Fi, some ISPs/VPNs) block outbound 5432 entirely,
 * which makes the app hang trying to connect even though the database
 * itself is fine — HTTP on 443 sidesteps that completely. Local/Docker
 * Postgres (no "neon.tech" in the URL) keeps using the regular postgres.js
 * driver, since there's no such restriction there and it supports the full
 * feature set (transactions, etc.).
 */
export const db = isNeon
  ? drizzleNeon(neon(connectionString), { schema })
  : (() => {
      const client =
        global.__dbClient ??
        postgres(connectionString, {
          max: process.env.NODE_ENV === "production" ? 10 : 1,
        });
      if (process.env.NODE_ENV !== "production") {
        global.__dbClient = client;
      }
      return drizzlePostgres(client, { schema });
    })();
