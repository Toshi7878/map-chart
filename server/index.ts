import { Hono } from "hono";
import mapRoute from "./routes/map/map";

const app = new Hono().basePath("/api").route("/maps", mapRoute);

export default app;
export type AppType = typeof app;
