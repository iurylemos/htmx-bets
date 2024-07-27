import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { prisma } from "./database";
import { Liquid } from "liquidjs";

dotenv.config();

const application = express();
const PORT = process.env.PORT || 3000;

const liquidEngine = new Liquid();

application.use(express.static("public"));

application.engine("liquid", liquidEngine.express());
application.set("views", "./src/views");
application.set("view engine", "liquid");

application.get("/", (req: Request, resp: Response) => {
  resp.render("index");
});

application.get("/about", (req: Request, resp: Response) => {
  resp.render("about");
});

application.get("/db", async (req: Request, resp: Response) => {
  try {
    const total = await prisma.todo.count();
    resp.send({ total });
  } catch (error) {
    console.log("error");
  }
});

application.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
