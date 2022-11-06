import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import urlExist from "url-exist";
import URL from "./models/urlModel.js";

const __dirname = path.resolve();

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // This line helps us server static files in the public folder. Here we'll write our CSS and browser javascript code

mongoose.connect(process.env.MONGO_DB_URI, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Database connected successfully");
  });

app.listen(8000, () => {
  console.log("App listening on port 8000");
});