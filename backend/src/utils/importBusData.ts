import { PrismaClient } from "@prisma/client";
import csvtojson from "csvtojson";
import { readdir } from "fs";
import { join } from "path";

const prisma = new PrismaClient() as any;

const ImportBusData = (folder: string) => {
    const fullFolderPath = join(__dirname, folder);
    readdir(fullFolderPath, async (err, files) => {
        if (err) {
            console.error(err);
            return;
        }

        const order = [
            "routes",
            "trips",
            "shapes",
            "stops",
            "stop_times",
            "calendar",
            "calendar_dates",
        ];

        files.sort((a, b) => {
            const aIndex = order.indexOf(a.split(".")[0]);
            const bIndex = order.indexOf(b.split(".")[0]);
            return aIndex - bIndex;
        });

        console.log(files);

        const toChunk = function* (items: any[], chunkSize: number) {
            let index = 0;

            while (index < items.length) {
                const currentChunk = items.slice(index, index + chunkSize);
                index += chunkSize;
                yield currentChunk;
            }
        };

        const chunkSize = 100;

        for (let fileName of files) {
            const jsonObj: any[] = await csvtojson({}).fromFile(
                join(fullFolderPath, fileName)
            );
            const splitFileName = fileName.split(".");
            console.log(splitFileName[0]);

            for (const batch of toChunk(jsonObj, chunkSize)) {
                try {
                    await prisma[splitFileName[0]].createMany({
                        data: batch,
                        skipDuplicates: true,
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        }

        // console.log(createMany);
    });
};

export default ImportBusData;

// ImportBusData("../../../data/marsrutusaraksti03_2023");
