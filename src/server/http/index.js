import express from "express";
import path from "path";

import settings from "server/settings";

const app = express();
const base = settings.SERVER_ROOT_DIR;
const adminRoot = path.join(base, "..", "..", "build-admin");
const gameRoot = path.join(base, "..", "..", "build-client");

const adminRouter = express.static(adminRoot);
const gameRouter = express.static(gameRoot);

app.use("/admin", adminRouter);
app.use("/admin/*", adminRouter);
app.use("/", gameRouter);
app.use("/*", gameRouter);

export default app;
