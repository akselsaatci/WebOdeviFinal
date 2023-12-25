import { RegisterRequest } from "./../data/dtos/userRegisterRequest";
import express, { Request, Response } from "express";
import LoginRequest from "../data/dtos/loginRequest";
import db from "../lib/db";
import { generateAccessToken, verifyToken } from "../lib/jwt";
import jwtDto from "../data/dtos/jwtDto";
import { User } from "@prisma/client";
import PostComplaint from "../data/dtos/postComplaint";
const router = express.Router();

router.post("/login", async function (req: Request, res: Response) {
  const dataFromBody = req.body as LoginRequest;
  if (!dataFromBody || !dataFromBody.email || !dataFromBody.password) {
    res.status(400).send("Bad Request");
    return;
  }

  const user = await db.user.findFirst({
    where: {
      email: dataFromBody.email,
      password: dataFromBody.password,
    },
  });
  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const claim: jwtDto = {
    tc: user.tc,
    id: null,
    email: user.email,
    nameSurname: user.name,
    type: "user",
  };

  const token = generateAccessToken(claim);
  if (!token) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.cookie("token", token, {
    domain : "localhost",
  });

  res.status(200).json({ token: token });
});

router.post("/register", async function (req: Request, res: Response) {
  const dataFromBody = req.body as RegisterRequest;
  if (
    !dataFromBody ||
    !dataFromBody.email ||
    !dataFromBody.password ||
    !dataFromBody.tc ||
    !dataFromBody.name
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          tc: dataFromBody.tc,
        },
        {
          email: dataFromBody.email,
        },
      ],
    },
  });
  if (user) {
    res.status(401).send("Email or TC already exists");
    return;
  }

  await db.user
    .create({
      data: {
        email: dataFromBody.email,
        password: dataFromBody.password,
        tc: dataFromBody.tc,
        name: dataFromBody.name,
      },
    })
    .catch((err) => {
      // maybe add logs ?
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });

  const claim: jwtDto = {
    tc: dataFromBody.tc,
    id: null,
    email: dataFromBody.email,
    nameSurname: dataFromBody.name,
    type: "user",
  };

  const token = generateAccessToken(claim);
  if (!token) {
    res.status(500).send("Internal Server Error");
    return;
  }

  res.cookie("token", token, { httpOnly: true });

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

  if (!claim.tc) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userDetails = await db.user.findFirst({
    where: {
      tc: claim.tc,
    },
  });
  if (!userDetails) {
    res.cookie("token", "", { httpOnly: true });
    return res.status(401).send("Unauthorized");
  }
  userDetails.password = "";
  return res.status(200).send(userDetails);
});

// update profile
router.post("/profile", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dataFromBody = req.body as {
    name: string;
    email: string;
    password: string;
  };

  if (
    !dataFromBody ||
    !dataFromBody.name ||
    !dataFromBody.email ||
    !dataFromBody.password
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  if (!claim.tc) {
    res.status(401).send("Unauthorized");
    return;
  }

  const userDetails = await db.user.update({
    where: {
      tc: claim.tc,
    },
    data: {
      name: dataFromBody.name,
      email: dataFromBody.email,
      password: dataFromBody.password,
    },
  });

  return res.status(200).json(userDetails);
});

// get all complaints
router.get("/complaints", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  console.log(claim);
  if (!claim) {
    return res.status(401).send("Unauthorized");
  }

  if (!claim.tc) {
    return res.status(401).send("Unauthorized");
  }

  const complaints = await db.complaint.findMany({
    where: {
      authorTc: claim.tc,
    },
  });
  return res.status(200).json(complaints);
});

// post a complaint to a firm
router.post("/complaints", async function (req: Request, res: Response) {
  const claim = await verifyToken(req, res);
  if (!claim) {
    return res.status(401).send("Unauthorized");
  }
  const dataFromBody = req.body as PostComplaint;
  if (!dataFromBody) {
    return res.status(400).send("Bad Request");
  }
  if (!claim.tc) {
    return res.status(400).send("Bad Request");
  }
  if (!dataFromBody.firmId || !dataFromBody.title || !dataFromBody.content) {
    return res.status(400).send("Bad Request");
  }
  // parse companyId
  const intCompanyId = parseInt(dataFromBody.firmId);
  if (isNaN(intCompanyId)) {
    return res.status(400).send("Bad Request");
  }

  const complaint = db.complaint

    .create({
      data: {
        authorTc: claim.tc,
        companyId: intCompanyId,
        title: dataFromBody.title,
        content: dataFromBody.content,
      },
    })
    .catch((err) => {
      // baddd
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });

  return res.status(200).send(complaint);
});

// get complaints made to a firm
// implement later
router.get("/complaints/:id", function (req: Request, res: Response) {});

module.exports = router;
