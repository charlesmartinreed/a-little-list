require("dotenv").config();

const { JSDOM } = require("jsdom");
const { createClient } = require("@supabase/supabase-js");

const path = require("path");
const express = require("express");

// ENV VARIABLES
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT || 6500;

// API VARIABLES

const app = express();

app.use(express.static(`${__dirname}`));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get("/list/:username", (req, res) => {
  // if = req.params;
  // grab the email add from the params
  // use that to pull the info from the DB
  let { email } = req.params;

  if (email === "guest") {
    console.log("guest mode active");
  } else {
    console.log("pulling DB items for user", email);
  }

  if (username === null) {
    res.redirect("/");
  }

  res.sendFile(`${__dirname}/list.html`);
});

app.get("/api/prices/:itemName", (req, res) => {
  let fetchedPrices = generateRandomPrices();
  res.status(200).json(fetchedPrices);
});

function generateRandomPrices() {
  let priceCount = Math.round(Math.random() * (8 - 2) + 2);
  let prices = [];

  for (let i = 0; i < priceCount; i++) {
    prices.push(Math.random() * (20 - 1) + 1);
  }

  return prices;
}

app.use((req, res, next) => {
  res.status(404).redirect("/");
});

app.listen(PORT, HOST, () => console.log("now listening on PORT", HOST, PORT));

async function requestAPIAccessToken() {
  // TODO: ADD WEB SCRAPING
}

function encodeStringWithUnicode(value) {
  // TODO: ADD WEB SCRAPING
  // return `{{${Buffer.from(value, "utf8").toString("base64")}}}`;
}
