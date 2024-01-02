// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";
import expressLayouts from 'express-ejs-layouts';
import path from "path";
import db from "./lib/db";
import session from 'express-session';
import jwtDto from "./data/dtos/jwtDto";

declare module 'express-session' {
    interface SessionData {
        user: jwtDto | null;
    }
}

dotenv.config();

const app: Express = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts);

app.use(session({
    secret: "zort",
    resave: false,
    saveUninitialized: true
}));


app.use(express.json());
const port = process.env.PORT ?? 3000;

app.get("/", (req: Request, res: Response) => {
    const user = req.session.user;

    res.render("homepage", { user })
});


app.get("/sikayetler", async (req: Request, res: Response) => {
    const user = req.session.user;
    const complaints = await db.complaint.findMany({
        include: {
            company: true,
            author : true
        },

    });
    res.render("sikayetler", { user ,complaints})
});



app.use(express.static(__dirname + '/public'));
app.use("/company", require("./routes/company"));
app.use("/user", require("./routes/user"));

app.use("/complaint", require("./routes/complaint"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post("/login", (req: Request, res: Response) => {
    res.send("Login");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
