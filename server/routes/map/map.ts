import { Hono } from "hono";
import mapListRoute from "./list";

const mapRoute = new Hono().route("/", mapListRoute);

export default mapRoute;
