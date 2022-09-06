"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tracer_1 = require("./helper/tracer");
const node_cron_1 = __importDefault(require("node-cron"));
const batch_1 = require("./controller/batch");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = "8080";
app.use((0, cors_1.default)());
app.get("/batch", batch_1.getBatch);
app.get("/batch/:id", batch_1.getResults);
//runs every minute 
node_cron_1.default.schedule("* * * * *", () => {
    console.log("running job...");
    (0, tracer_1.tracert)("google.com");
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
