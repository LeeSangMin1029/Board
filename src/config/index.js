import passport from "./passport";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  dirname: path.dirname(new URL(
    import.meta.url).pathname).slice(1, 19),
  secret: process.env.SECRETKEY || "anyKey",
  passport: passport,
};