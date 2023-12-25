import express, { Request, Response } from "express";
import db from "../lib/db";
const router = express.Router();

// get all complaints with pagination
router.get("/", function (req: Request, res: Response) {
  const { page } = req.query;

  if (!page) {
    return res.status(400).send("Bad Request");
  }
  //parse to int
  const pageNumber = parseInt(page as string);
  if (isNaN(pageNumber)) {
    return res.status(400).send("Bad Request");
  }

  const complaints = db.complaint.findMany({
    skip: (pageNumber - 1) * 10,
    take: 10,
  });

  return res.status(200).json(complaints);
});

// get complaints made by user
router.get("/complaints/:id", function (req: Request, res: Response) {});

module.exports = router;
