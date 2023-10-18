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
app.use(express.static(path.join(__dirname, "./public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/room", (req, res) => {
  const { username, roomname } = req.body;
  res.redirect(`/room?username=${username}&roomname=${roomname}`);
});

app.get("/room", (req, res) => {
  res.render("room");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
