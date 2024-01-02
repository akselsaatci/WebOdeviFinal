import { Request, Response } from "express";
import db from "../lib/db";

const showComplaintsByUser = async (req: Request, res: Response) => {
  try {
    const claim = req.session.user;
    console.log(claim);

    if (!claim || !claim.tc) {
      return res.redirect("/");
    }

    const complaints = await db.complaint.findMany({
      where: {
        authorTc: claim.tc,
      },
      include: {
        company: true,
      },
    });
    console.log(complaints);

    res.render("musteri/index", { complaints, user: claim });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

export { showComplaintsByUser };
