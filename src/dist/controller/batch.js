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
exports.getResults = exports.getBatch = void 0;
const client_1 = __importDefault(require("../db/client"));
const getBatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getBatches = yield client_1.default.batch.findMany({
        select: {
            id: true,
            destinationIp: true,
            destinationAdres: true,
            hops: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return res.json({ "data": getBatches });
});
exports.getBatch = getBatch;
const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = +req.params.id;
    const getResults = yield client_1.default.result.findMany({
        where: {
            batchId: id,
        },
        select: {
            id: true,
            hop: true,
            ip: true,
            date: true,
        },
    });
    return res.json({ "data": getResults });
});
exports.getResults = getResults;
