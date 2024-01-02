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

router.get("/complaints/:id", async function (req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Bad Request");
  }

  const complaints = await db.complaint.findMany({
    where: {
      id: parseInt(id),
    },
    include: {
      author: true,
      company: true,
    },
  });
  return res.status(200).json(complaints);
});

router.delete("/complaints/:id", async function (req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send("Bad Request");
  }

  const complaints = await db.complaint.delete({
    where: {
      id: parseInt(id),
    },
  });
  return res.status(200).json(complaints);
});

router.put("/complaints/:id", async function (req: Request, res: Response) {
  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content) {
    return res.status(400).send("Bad Request");
  }

  const complaints = await db.complaint.update({
    where: {
      id: parseInt(id),
    },
    data: {
      content: content,
    },
  });
  return res.status(200).json(complaints);
});
module.exports = router;
