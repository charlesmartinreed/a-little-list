require("dotenv").config();

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

app.get("/list", (req, res) => {
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
