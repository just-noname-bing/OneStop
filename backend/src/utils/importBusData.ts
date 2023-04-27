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

		files.forEach(async (fileName) => {
			const jsonObj = await csvtojson({}).fromFile(join(fullFolderPath, fileName));

			console.log(fileName.split(".")[0]);

			const createMany = await prisma[fileName.split(".")[0]].createMany({
				data: jsonObj,
				skipDuplicates: true,
			});

			console.log(createMany);
		});
	});
};

export default ImportBusData;

// ImportBusData("../../../data/marsrutusaraksti03_2023");
