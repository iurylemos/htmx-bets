import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const application = express();
const PORT = process.env.PORT || 3000;

application.get("/", (req: Request, resp: Response) => {
  resp.send("Express + Typescript Server");
});

application.get("/db", (req: Request, resp: Response) => {
  resp.send("Express + Typescript Server");
});

application.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
