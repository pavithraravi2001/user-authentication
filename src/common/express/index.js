import bodyParser from "body-parser";
import { errorHandler as bodyErrorHandler } from "bodymen";
import compression from "compression";
import cors from "cors";
import express from "express";
import forceSSL from "express-force-ssl";
import morgan from "morgan";
import { errorHandler as queryErrorHandler } from "querymen";
import { env } from "../../config";
var path = require("path");

export default (apiRoot, routes) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));
  app.set("view engine", "ejs");

  app.get("/", (req, res) => {
    res.render("index.ejs");
  });

  /* istanbul ignore next */
  if (env === "production") {
    app.set("forceSSLOptions", {
      enable301Redirects: false,
      trustXFPHeader: true,
    });
    app.use(forceSSL);
  }

  app.use(cors());
  app.options("*", cors());
  app.use(compression());
  app.use(morgan("dev"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(apiRoot, routes);
  app.use(queryErrorHandler());
  app.use(bodyErrorHandler());

  return app;
};
