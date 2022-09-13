// import * as dotenv from "dotenv";
// dotenv.config();
require("dotenv").config();

// import fetch from "node-fetch";
// const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const path = require("path");
const express = require("express");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.SERVER_PORT || 6500;
const CORS_PORT = process.env.CORS_PORT || 5500;

const app = express();

// let proxy = require("cors-anywhere")
//   .createServer({
//     originWhitelist: [],
//     requireHeader: ["origin", "x-requested-with"],
//     removeHeaders: ["cookie", "cookie2"],
//   })
//   .listen(CORS_PORT, HOST, (req, res) => {
//     console.log(`Now running CORS Anywhere on ${HOST}:${CORS_PORT}`);
//   });

// import * as cors_proxy from "cors-anywhere";

// const proxyURL = `http://${HOST}:${PORT}`;

let itemList;

// let proxy = cors_proxy
//   .createServer({
//     originWhitelist: [],
//     requireHeader: ["origin", "x-requested-with"],
//     removeHeaders: ["cookie", "cookie2"],
//   })
//   .listen(PORT, HOST, (req, res) => {
//     console.log(`Now running CORS Anywhere on ${HOST}:${PORT}`);
//   });

// app.use("/", express.static(__dirname + "/public"));

app.use(express.static(`${__dirname}/public`));
app.use(express.json());

// app.get("*", (req, res) => {
//   if (req.hostname === "walmart.com") {
//     console.log("walmart route triggered");
//     proxy.emit("request", req, res);
//   }
// });

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

// app.use(express.static(path.join(__dirname, "public/css")));
// app.use(express.static(path.join(__dirname, "public/scripts")));

// /home/charlesmartinreed/personal-portfolio/a-little-list/public/pages/index.html

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "pages", "index.html"));
// });

// will be login protected
// app.get("/list", (req, res) => {
//   res.sendFile(path.join(__dirname, "list.html"));
// });

app.listen(PORT, HOST, () => console.log("now listening on PORT", HOST, PORT));

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

// async function returnAvgPrice() {
//   for (let item of itemList) {
//     let url = `${proxyURL}/https://www.walmart.com/search?q=${item.item_name}`;
//     console.log("fetching for", url);
//     try {
//       let res = await fetch(url, {
//         headers: {
//           Origin: "https://www.walmart.com",
//         },
//       });

//       let dom = new JSDOM(res.body);
//       let { avgPrice } = await convertToHTMLAndParse(dom);
//       item.item_avg_price = avgPrice;
//     } catch (e) {
//       console.error(e);
//     }
//   }
// }

// async function convertToHTMLAndParse(pageDOM) {
//   let results = Array.prototype.slice
//     .call(pageDOM.window.document.querySelectorAll("div"))
//     .filter(
//       (div) => div.getAttribute("data-automation-id") === "product-price"
//     );

//   let prices = results.map((div) => div.querySelector("span.w_CR").outerText);
//   let priceValues = prices.map((priceStr) =>
//     priceStr.replace(/[^0-9|^.]/gi, "")
//   );

//   let avgPrice;

//   try {
//     avgPrice =
//       priceValues.map((price) => parseFloat(price)).reduce((a, b) => a + b) /
//       priceValues.length;
//   } catch (e) {
//     console.error(e);
//     avgPrice = 0;
//   }

//   return { avgPrice };
// }

// async function updateItemPrices() {
//   //   if (allItems.length > 0) {
//   //     allItems = allItems.map((item) => {
//   //       let { item_avg_price } = item;
//   //       if (
//   //         localStorage.getItem("item-prices") &&
//   //         localStorage.getItem("item-prices").length > 0
//   //       ) {
//   //         let { avgPrice } = fetchWebSiteResults(item);
//   //         if (avgPrice) {
//   //           item_avg_price = avgPrice;
//   //         } else {
//   //           displayItemList(allItems);
//   //           return;
//   //         }
//   //       }
//   //     });
//   //   }
// }

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
