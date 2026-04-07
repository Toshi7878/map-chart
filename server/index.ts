import { Hono } from "hono";
import maps from "./routes/map/map";

const app = new Hono();

const routes = app.basePath("/api").route("/maps", maps);

export default app;
export type AppType = typeof routes;
