import express from "express";
import dotenv from "dotenv";
import path from "path";
import urlExist from "url-exist";
import axios from "axios";

const __dirname = path.resolve();

dotenv.config();

const validateURL = async (req, res, next) => {
  const { url } = req.body;
  const isExist = await urlExist(url);
  if (!isExist) {
    return res.json({ message: "Invalid URL", type: "failure" });
  }
  next();
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

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
})
.catch(function (error) {
    res.send(JSON.stringify(error.response.data));
    console.log(error);
});

});


app.post("/link", validateURL, (req, res) => {
  const { url } = req.body;  
  const { id } = req.body;

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
    res.json({ message: `${consume_url}${response.data.data.result.UrlShortID}`, type: "success" });
  })
  .catch(function (error) {
    console.log(error.response);
  });
});


app.listen(8000, () => {
  console.log("App listening on port 8000");
});