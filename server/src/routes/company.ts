import express, { Request, Response } from "express";
import LoginRequest from "../data/dtos/loginRequest";
import db from "../lib/db";
import { generateAccessToken, verifyToken } from "../lib/jwt";
import jwtDto from "../data/dtos/jwtDto";
import { Company } from "@prisma/client";
import FirmRegisterRequest from "../data/dtos/firmRegisterRequest";
import { PostAnswer } from "../data/dtos/postAnswer";
const router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const claim = req.session.user;
  if (!claim) {
    return res.redirect("/");
  }

  const companies = await db.complaint
    .findMany({
      include: {
        company: true,
        author: true,
      },
      where: {
        companyId: claim.id || 0,
      },
    })
    .catch((err) => {
      // maybe add logs ?
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });

  return res.render("firma/index", { user: claim, complaints: companies });
});

router.get("/categories", async function (req: Request, res: Response) {
  const companies = await db.companyCategory
    .findMany({
      select: {
        id: true,
        name: true,
      },
    })
    .catch((err) => {
      // maybe add logs ?
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });

  return res.status(200).json(companies);
});

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

  req.session.user = claim;

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

// get profile
router.get("/profile", async function (req: Request, res: Response) {
  const claim = req.session.user;
  if (!claim) {
    res.redirect("/");
    return;
  }

  if (!claim.id) {
    res.redirect("/");
    return;
  }

  const userDetails = await db.company.findFirst({
    where: {
      id: claim.id,
    },
  });
  if (!userDetails) {
    return res.redirect("/");
  }
  userDetails.authorizedPersonPassword = "";
  return res.render("firma/profile", { user: userDetails });
});

// update profile
router.post("/profile", async function (req: Request, res: Response) {
  const claim = req.session.user;
  if (!claim) {
    res.status(401).send("Unauthorized");
    return;
  }

  const dataFromBody = (await req.body) as {
    firmaSifre: string;
    firmaAdi: string;
    firmaYetkiliAdi: string;
    firmaYetkiliEmail: string;
    firmaYetkiliTelefon: string;
  };

  if (!dataFromBody) {
    res.status(400).send("Bad Request");
    return;
  }

  if (!claim.id) {
    res.status(401).send("Unauthorized");
    return;
  }

  // null check for datafrombody
  if (
    !dataFromBody.firmaSifre ||
    !dataFromBody.firmaAdi ||
    !dataFromBody.firmaYetkiliAdi ||
    !dataFromBody.firmaYetkiliEmail ||
    !dataFromBody.firmaYetkiliTelefon
  ) {
    res.status(400).send("Bad Request");
    return;
  }

  const userDetails = await db.company
    .update({
      where: {
        id: claim.id,
      },
      data: {
        name: dataFromBody.firmaAdi,
        authorizedPersonEmail: dataFromBody.firmaYetkiliEmail,
        authorizedPersonPhone: dataFromBody.firmaYetkiliTelefon,
        authorizedPersonName: dataFromBody.firmaYetkiliAdi,
        authorizedPersonPassword: dataFromBody.firmaSifre,
      },
    })
    .catch((err) => {
      // maybe add logs ?
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });
  console.log(userDetails);
  console.log(dataFromBody);
  return res.redirect("/company/profile");
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
router.post("/complaint/:id", async function (req: Request, res: Response) {
  const { id } = req.params;

  const claim = req.session.user;
  if (!claim) {
    return res.redirect("/");
  }
  const dataFromBody = req.body as PostAnswer;
  if (!dataFromBody) {
    return res.status(400).send("Bad Request");
  }
  if (!claim.id) {
    return res.redirect("/");

  }

  const complaint = db.complaint
    .update({
      where: { id: parseInt(id) },
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

router.get("/all", function (req: Request, res: Response) {
  db.company
    .findMany({})
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
