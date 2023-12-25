import express, { Request, Response } from "express";
import LoginRequest from "../data/dtos/loginRequest";
import db from "../lib/db";
import { generateAccessToken, verifyToken } from "../lib/jwt";
import jwtDto from "../data/dtos/jwtDto";
import { Company } from "@prisma/client";
import FirmRegisterRequest from "../data/dtos/firmRegisterRequest";
import { PostAnswer } from "../data/dtos/postAnswer";
const router = express.Router();

router.post("/login", async function (req: Request, res: Response) {
  const dataFromBody = req.body as LoginRequest;
  if (!dataFromBody || !dataFromBody.email || !dataFromBody.password) {
    res.status(400).send("Bad Request");
    return;
  }

  const user = await db.company.findFirst({
    where: {
      authorizedPersonEmail: dataFromBody.email,
      authorizedPersonPassword: dataFromBody.password,
    },
  });
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const claim: jwtDto = {
    tc: null,
    id: user.id,
    email: user.authorizedPersonEmail,
    nameSurname: user.name,
    type: "company",
  };

  const token = generateAccessToken(claim);
  if (!token) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.cookie("token", token, { httpOnly: true });

  res.status(200).send("OK");
});

router.post("/register", async function (req: Request, res: Response) {
  const dataFromBody = req.body as FirmRegisterRequest;
  if (
    !dataFromBody ||
    !dataFromBody.authorizedPersonEmail ||
    !dataFromBody.authorizedPersonPassword ||
    !dataFromBody.name ||
    !dataFromBody.authorizedPersonEmail ||
    !dataFromBody.authorizedPersonPhone
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  const user = await db.company.findFirst({
    where: {
      authorizedPersonEmail: dataFromBody.authorizedPersonEmail,
    },
  });
  if (user) {
    res.status(401).send("Email exists");
    return;
  }

  const company = await db.company
    .create({
      data: {
        name: dataFromBody.name,
        authorizedPersonEmail: dataFromBody.authorizedPersonEmail,
        authorizedPersonPassword: dataFromBody.authorizedPersonPassword,
        authorizedPersonPhone: dataFromBody.authorizedPersonPhone,
        authorizedPersonName: dataFromBody.authorizedPersonName,
        categoryId: 1, // should change this
      },
    })
    .catch((err) => {
      // maybe add logs ?
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });
  res.status(200).send("OK");
});

router.get("/logout", function (req: Request, res: Response) {
  res.clearCookie("token");
  res.status(200).send("OK");
});

// get profile
router.get("/profile", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    res.status(401).send("Unauthorized");
    return;
  }

  if (!claim.id) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userDetails = await db.company.findFirst({
    where: {
      id: claim.id,
    },
  });
  if (!userDetails) {
    res.cookie("token", "", { httpOnly: true });
    return res.status(401).send("Unauthorized");
  }
  userDetails.authorizedPersonPassword = "";
  return res.status(200).send(userDetails);
});

// update profile
router.post("/profile", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dataFromBody = req.body as Company;

  if (!dataFromBody) {
    res.status(400).send("Bad Request");
    return;
  }

  if (!claim.id) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userDetails = await db.company.update({
    where: {
      id: claim.id,
    },
    data: {
      name: dataFromBody.name,
      authorizedPersonEmail: dataFromBody.authorizedPersonEmail,
      authorizedPersonPhone: dataFromBody.authorizedPersonPhone,
      authorizedPersonName: dataFromBody.authorizedPersonName,
      authorizedPersonPassword: dataFromBody.authorizedPersonPassword,
    },
  });

  return res.status(200).json(userDetails);
});

// get all complaints
router.get("/complaints", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    return res.status(401).send("Unauthorized");
  }
  if (!claim.id) {
    return res.status(401).send("Unauthorized");
  }
  const complaints = await db.complaint.findMany({
    where: {
      companyId: claim.id,
    },
  });
  return res.status(200).json(complaints);
});

// post a answer to a firm
router.post("/complaints", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    return res.status(401).send("Unauthorized");
  }
  const dataFromBody = req.body as PostAnswer;
  if (!dataFromBody) {
    return res.status(400).send("Bad Request");
  }
  if (!claim.id) {
    return res.status(401).send("Unauthorized");
  }

  const complaint = db.complaint
    .update({
      where: { id: dataFromBody.complaintId },
      data: {
        answer: dataFromBody.content,
        answeredAt: new Date(),
      },
    })
    .catch((err) => {
      // baddd
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });

  return res.status(200).send(complaint);
});

// get complaints made by user
// maybe implement this later
router.get("/complaints/:id", function (req: Request, res: Response) {});

module.exports = router;
