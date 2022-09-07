const Traceroute = require("nodejs-traceroute");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
import { DateTime } from "luxon";
import prisma from "../db/client";

interface IHop {
  ip: string;
  date: string;
  hop: number;
}

const initCsv = () => {
  const date = DateTime.now().toFormat("yy-MM-dd_HHmmss");
  const csvWriter = createCsvWriter({
    path: `./src/dump/result_${date}.csv`,
    header: [
      { id: "hop", title: "HOP" },
      { id: "ip", title: "IP" },
      { id: "date", title: "DATE" },
    ],
  });
  return csvWriter;
};

export const tracert = (url: string) => {
  const trace: IHop[] = [];
  let destinationIp: string;
  try {
    const tracer = new Traceroute();
    tracer
      .on("pid", (pid: any) => {
        console.log(`pid: ${pid}`);
      })
      .on("destination", (destination: any) => {
        destinationIp = destination;
        console.log(`destination: ${destination}`);
      })
      .on("hop", (hop: any) => {
        const obj: IHop = {
          hop: hop.hop,
          ip: hop.ip,
          date: DateTime.now().toISO(),
        };
        trace.push(obj);
        console.log(obj);
      })
      .on("close", async (code: any) => {
        console.log(`close: code ${code}`);
        console.log("data inserting...");
        initCsv().writeRecords(trace);
        const totalHops = trace.at(-1)?.hop ?? 0;
        const batch = await prisma.batch.create({
          data: {
            destinationIp: destinationIp,
            destinationAdres: url,
            hops: totalHops,
            results: {
              create: trace,
            },
          },
        });
        // console.log(batch);
        console.log("data inserted");
      });

    tracer.trace(url);
  } catch (ex) {
    console.log(ex);
  }
};
