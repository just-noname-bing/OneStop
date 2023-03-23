import "dotenv-safe/config";
import express from "express";

const PORT = Number(process.env.PORT);
const app = express();

app.get("/", (_, res) => res.send("test"));

app.listen(PORT, () => console.log("http://localhost:" + PORT));
