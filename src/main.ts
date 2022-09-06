import express, { Express, Request, Response } from "express";
import { tracert } from "./helper/tracer";
import cron from "node-cron";
import { getBatch, getResults } from "./controller/batch";
import cors from "cors";

const app: Express = express();
const port = "8080";
app.use(cors());



app.get("/batch", getBatch);
app.get("/batch/:id", getResults);


//runs every minute 
cron.schedule("* * * * *", () => {
  console.log("running job...");
  tracert("google.com");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
