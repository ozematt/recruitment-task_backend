import basicAuth from "express-basic-auth";
import { AUTH_PASSWORD, AUTH_USER } from "../config/env.js";

const authMiddleware = basicAuth({
  users: {
    [AUTH_USER]: AUTH_PASSWORD,
  },
  challenge: true,
});

export default authMiddleware;
