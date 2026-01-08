import serverlessHttp from "serverless-http";
import app from "../server.js";

const handler = serverlessHttp(app);

export default (req, res) => {
  if (!req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  return handler(req, res);
};
