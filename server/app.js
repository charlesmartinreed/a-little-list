import * as dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import express from "express";
import * as cors_proxy from "cors-anywhere";

const app = express();
app.use(express.json());

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT || 6500;
const proxyURL = `http://${HOST}:${PORT}`;

let itemList;

let proxy = cors_proxy
  .createServer({
    originWhitelist: [],
    requireHeader: ["origin", "x-requested-with"],
    removeHeaders: ["cookie", "cookie2"],
  })
  .listen(PORT, HOST, (req, res) => {
    console.log(`Now running CORS Anywhere on ${HOST}:${PORT}`);
  });

// app.get("/list", async (req, res) => {
//   let items = await fetchItemsFromDB();
//   res.json(items);
// });

// app.post("/list", async (req, res) => {
//   let newItem = req.body;
//   await addNewItemToDB(newItem);

//   let updatedItemList = await fetchItemsFromDB();
//   res.json(updatedItemList);
// });

// app.put("/list/:item", async (req, res) => {
//   let itemUpdateObj = req.body;
//   let itemName = req.params[item];

//   await updateItemInDB(itemName, itemUpdateObj);

//   let updatedItemList = await fetchItemsFromDB();
//   res.json(updatedItemList);
// });

function returnItemID() {
  let id = "";
  let idLen = 8;
  for (let i = 0; i < idLen; i++) {
    id += String(Math.round(Math.random() * 9));
  }

  return id;
}

async function fetchItemsFromDB() {
  // TODO: Pull from an actual DB...
  itemList = [
    {
      item_name: "pickles",
      item_id: returnItemID(),
      item_avg_price: null,
      item_is_recurrent: true,
      item_notes: "Test note entry",
    },
    {
      item_name: "vodka",
      item_id: returnItemID(),
      item_avg_price: null,
      item_is_recurrent: false,
      item_notes: "Test note entry",
    },
  ];

  await returnAvgPrice();
  console.log(itemList);

  return itemList;
}

async function addNewItemToDB(newItem) {
  newItem = {
    ...newItem,
    item_id: returnItemID(),
    item_is_recurrent: false,
    item_avg_price: "$0.00",
    item_notes: "New test note entry",
  };

  itemList = [...itemList, newItem];

  //   write updated list to DB here
}

async function updateItemInDB(itemName, itemUpdateObj) {
  let originalList = JSON.parse(await fetchItemsFromDB());

  originalList = originalList
    .find((item) => item.item_name === itemName)
    .map((item) =>
      Object.keys(item).forEach((key) => item[key] === itemUpdateObj[key])
    );

  itemList = originalList;
}

async function returnAvgPrice() {
  for (let item of itemList) {
    let url = `${proxyURL}/https://www.walmart.com/search?q=${item.item_name}`;
    console.log("fetching for", url);
    try {
      let res = await fetch(url, {
        headers: {
          Origin: "https://www.walmart.com",
        },
      });

      let dom = new JSDOM(res.body);
      let { avgPrice } = await convertToHTMLAndParse(dom);
      item.item_avg_price = avgPrice;
    } catch (e) {
      console.error(e);
    }
  }
}

async function convertToHTMLAndParse(pageDOM) {
  let results = Array.prototype.slice
    .call(pageDOM.window.document.querySelectorAll("div"))
    .filter(
      (div) => div.getAttribute("data-automation-id") === "product-price"
    );

  let prices = results.map((div) => div.querySelector("span.w_CR").outerText);
  let priceValues = prices.map((priceStr) =>
    priceStr.replace(/[^0-9|^.]/gi, "")
  );

  let avgPrice;

  try {
    avgPrice =
      priceValues.map((price) => parseFloat(price)).reduce((a, b) => a + b) /
      priceValues.length;
  } catch (e) {
    console.error(e);
    avgPrice = 0;
  }

  return { avgPrice };
}

fetchItemsFromDB();

async function updateItemPrices() {
  //   if (allItems.length > 0) {
  //     allItems = allItems.map((item) => {
  //       let { item_avg_price } = item;
  //       if (
  //         localStorage.getItem("item-prices") &&
  //         localStorage.getItem("item-prices").length > 0
  //       ) {
  //         let { avgPrice } = fetchWebSiteResults(item);
  //         if (avgPrice) {
  //           item_avg_price = avgPrice;
  //         } else {
  //           displayItemList(allItems);
  //           return;
  //         }
  //       }
  //     });
  //   }
}
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
