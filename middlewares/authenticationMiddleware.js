// middlewares/auth.js
import dotenv from "dotenv";
dotenv.config();
import { expressjwt } from "express-jwt";

const authenticate = expressjwt({
  secret: process.env.SECRETKEY,
  algorithms: ["HS256"],
  getToken: (req) => {
    return req.cookies?.token || null;
  },
});


export default authenticate;
