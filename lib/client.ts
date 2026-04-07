import { hc } from "hono/client";
import type { AppType } from "@/server";

export const client = hc<AppType>(typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
