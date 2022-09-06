import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { load } from "cheerio";

import express from "express";
import axios from "axios";
import * as cors_proxy from "cors-anywhere";

const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT || 6500;

// http://localhost:6500/https://www.walmart.com/search?q=pickles

let proxy = cors_proxy
  .createServer({
    originWhitelist: [],
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(PORT, HOST, (req, res) => {
    console.log(`Now running CORS Anywhere on ${HOST}:${PORT}`);
  });

app.get("/proxy/:proxyUrl*", (req, res) => {
  req.url = req.url.replace("/proxy/", "/");
  proxy.emit("request", req, res);
});
// grab the results div: let itemDivs = Array.from(document.querySelectorAll('div')).filter((div) => div.classList.contains('b--near-white'));
// check the name of the item, if name contains item_name, keep crawling, if not, return: let itemName = itemDivs[1].querySelector('a span').textContent;
// grab the price : let itemPrice = itemDivs[1].querySelector('div.lh-copy')
// add each price to an array and then copy that to item object's persistent prices array

/*
ADDITIONAL CRAWLER NOTES
walmart results breakdown

mb1 ph1 pa0-xl bb b--near-white w-25
item begins with
div with data-item-id=""
 -> a with link-identifier="" (optional?)
 -> span with class="w_CR" textContents contains ${item_name}

... children ...

div with data-automation-id="product-price"
 -> span with class="w_CR"
   -> textContent should contain somethng like 'current price $0.20'



*/
