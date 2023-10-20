/* eslint-disable no-unused-vars */
const express = require("express");
const bodyParser = require("body-parser");
const socket = require("socket.io");
const path = require("path");
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("views", `${__dirname  }/views`);
app.set("view engine", "ejs");
app.use(express.static(`${__dirname  }/public`));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/chat", (req, res) => {
  const { username, roomname } = req.body;
  res.redirect(`/chat?username=${username}&roomname=${roomname}`);
});

app.get("/chat", (req, res) => {
  res.render("chat");
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Server Running on port http://localhost:${port}`);
});

const io = socket(server);
require("./functions/socket")(io);
