"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tracert = void 0;
const Traceroute = require("nodejs-traceroute");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const luxon_1 = require("luxon");
const client_1 = __importDefault(require("../client"));
const initCsv = () => {
    const date = luxon_1.DateTime.now().toFormat("yy-MM-dd_HHmmss");
    const csvWriter = createCsvWriter({
        path: `./dump/result_${date}.csv`,
        header: [
            { id: "hop", title: "HOP" },
            { id: "ip", title: "IP" },
            { id: "date", title: "DATE" },
        ],
    });
    return csvWriter;
};
const tracert = (url) => {
    const trace = [];
    let destinationIp;
    try {
        const tracer = new Traceroute();
        tracer
            .on("pid", (pid) => {
            console.log(`pid: ${pid}`);
        })
            .on("destination", (destination) => {
            destinationIp = destination;
            console.log(`destination: ${destination}`);
        })
            .on("hop", (hop) => {
            const obj = {
                hop: hop.hop,
                ip: hop.ip,
                date: luxon_1.DateTime.now().toISO(),
            };
            trace.push(obj);
            console.log(obj);
        })
            .on("close", (code) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            console.log(`close: code ${code}`);
            console.log("data inserting...");
            initCsv().writeRecords(trace);
            const totalHops = (_a = trace.at(-1)) === null || _a === void 0 ? void 0 : _a.hop;
            const batch = yield client_1.default.batch.create({
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
        }));
        tracer.trace(url);
    }
    catch (ex) {
        console.log(ex);
    }
};
exports.tracert = tracert;
