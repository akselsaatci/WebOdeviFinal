// wiki.js - Wiki route module.

import express, { Request, Response } from "express";
const router = express.Router();

router.post("/login", function (req: Request, res: Response) {
  res.send("Wiki home page");
});

router.post("/register", function (req: Request, res: Response) {
  res.send("Wiki home page");
});

router.get("/logout", function (req: Request, res: Response) {
  res.send("About this wiki");
});

// get profile
router.get("/profile", function (req: Request, res: Response) {});

// update profile 
router.post("/profile", function (req: Request, res: Response) {});

// get all complaints
router.get("/complaints", function (req: Request, res: Response) {});

// post a complaint to a firm
router.post("/complaints", function (req: Request, res: Response) {});

// get complaints made to a firm
router.get("/complaints/:id", function (req: Request, res: Response) {});

module.exports = router;
