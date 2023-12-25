import jwt from "jsonwebtoken";
import jwtDto from "../data/dtos/jwtDto";
import { Request, Response } from "express";
const secret = process.env.TOKEN_SECRET as string;

if (!secret) {
  throw new Error("No secret provided");
}

export function generateAccessToken(user: jwtDto) {
  return jwt.sign(user, secret, { expiresIn: "1800s" });
}


export async function verifyToken(req: Request, res: Response): Promise<jwtDto | void> {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const user = await jwt.verify(token, process.env.TOKEN_SECRET as string) as jwtDto;
    console.log(user);

    // If needed, you can return a jwtDto object here
    return user ;
  } catch (err) {
    console.log(err);

    res.sendStatus(403);
  }
}