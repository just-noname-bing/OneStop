"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const csvtojson_1 = __importDefault(require("csvtojson"));
const fs_1 = require("fs");
const path_1 = require("path");
const prisma = new client_1.PrismaClient();
const ImportBusData = (folder) => {
    const fullFolderPath = (0, path_1.join)(__dirname, folder);
    (0, fs_1.readdir)(fullFolderPath, async (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach(async (fileName) => {
            const jsonObj = await (0, csvtojson_1.default)({}).fromFile((0, path_1.join)(fullFolderPath, fileName));
            console.log(fileName.split(".")[0]);
            const createMany = await prisma[fileName.split(".")[0]].createMany({
                data: jsonObj,
                skipDuplicates: true,
            });
            console.log(createMany);
        });
    });
};
exports.default = ImportBusData;
ImportBusData("../../../data/marsrutusaraksti03_2023");
//# sourceMappingURL=importBusData.js.map