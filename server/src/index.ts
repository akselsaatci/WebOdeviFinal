// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Use express.json() middleware to parse JSON bodies
app.use(express.json());
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
