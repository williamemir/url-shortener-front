import express from "express";
import dotenv from "dotenv";
import path from "path";
import urlExist from "url-exist";
import URL from "./models/urlModel.js";
import axios from "axios";

const __dirname = path.resolve();

dotenv.config();

const validateURL = async (req, res, next) => {
  const { url } = req.body;
  console-console.log("Revision de middleware del body: ", req.body);
  console-console.log("Revision de middleware de variable url: ", url);
  const isExist = await urlExist(url);
  if (!isExist) {
    return res.json({ message: "Invalid URL", type: "failure" });
  }
  next();
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public")); // This line helps us server static files in the public folder. Here we'll write our CSS and browser javascript code

/*
mongoose.connect(process.env.MONGO_DB_URI, (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Database connected successfully");
  });
*/

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/public/favicon.ico");
});


app.get("/:id", async (req, res) => {
  const id = req.params.id;
  let url = process.env.DEV_API_GET_URL+id;
  
  console.log(url);
  
  axios({
    method:'get',
    url,
})
.then(function (response) {
    res.redirect(response.data.data["data"].url);
    console.log(response.data.data["data"].url);
    //res.send(JSON.stringify(response.data));
})
.catch(function (error) {
    res.send(JSON.stringify(error.response.data));
    console.log(error);
});

  /*
  const redirectURL = await URL.findOne({ id });

  if (!redirectURL) {
    return res.sendFile(__dirname + "/public/404.html");
  }
  // res.redirect(redirectURL.url);
  */
});


app.post("/link", validateURL, (req, res) => {
  const { url } = req.body;  
  const { id } = req.body;
  console.log("Revision del endpoint de request: ", req.body);
  console.log("Revision del endpoint de id: ", url);
  console.log("Revision del endpoint de url: ", id);

  let url_create = process.env.DEV_API_CREATE_URL;

  let consume_url = process.env.DEV_BASE_URI;
  axios({
    method: 'post',
    url: url_create,
    data: {
      id: id,
      url: url
    }
  }).then(function (response) {
    console.log(response.data);
    console.log(response.data.data.result.UrlShortID);
    res.json({ message: `${consume_url}${response.data.data.result.UrlShortID}`, type: "success" });
  })
  .catch(function (error) {
    console.log(error.response);
  });
});


app.listen(8000, () => {
  console.log("App listening on port 8000");
});