// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/company", require("./routes/company"));
app.use("/user", require("./routes/user"));
app.use("/complaint", require("./routes/complaint"));

app.post("/login", (req: Request, res: Response) => {
  res.send("Login");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
