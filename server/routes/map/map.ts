import { Hono } from "hono";
import mapListRoute from "./list";

const maps = new Hono().route("/", mapListRoute);

export default maps;
