// import * as dotenv from "dotenv";
// dotenv.config();
require("dotenv").config();

// import fetch from "node-fetch";
// const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");
const { createClient } = require("@supabase/supabase-js");

const path = require("path");
const express = require("express");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT || 6500;
const CORS_PORT = process.env.CORS_PORT || 5500;

const app = express();
createClient(`${process.env.SUPABASE_DB_URL}`, `${process.env.SUPABASE_DB_PW}`);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/list", (req, res) => {
  let userIsGuest = req.query.is_guest;

  if (userIsGuest === "true") {
    console.log(userIsGuest, "guest mode active");
  } else {
    console.log("no query string passed");
  }

  res.sendFile(`${__dirname}/list.html`);
});

app.use((req, res, next) => {
  res.status(404).redirect("/");
});

app.listen(PORT, HOST, () => console.log("now listening on PORT", HOST, PORT));

async function handleLogin(user, pw) {}
