import jwt from "jsonwebtoken";
const secret = process.env.TOKEN_SECRET as string;

if (!secret) {
  throw new Error("No secret provided");
}

function generateAccessToken(username: string) {
  return jwt.sign(username, secret, { expiresIn: "1800s" });
}
function verifyToken(token: string) {
  return jwt.verify(token, secret);
}
