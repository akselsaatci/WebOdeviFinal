// wiki.js - Wiki route module.

import express, { Request, Response } from "express";
const router = express.Router();

// get all complaints with pagination
router.get("/", function (req: Request, res: Response) {});

// get complaints made by user
router.get("/complaints/:id", function (req: Request, res: Response) {});

module.exports = router;
