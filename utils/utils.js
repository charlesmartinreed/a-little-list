export async function fetchWebSiteResults(item) {
  let { item_name, item_price_results, item_avg_price } = item;
  let proxyURL = "http://localhost:6500";
  let URL = `${proxyURL}/https://www.walmart.com/search?q=${item_name}`;

  console.log("route hit, attempting to fetch data", URL);
  // console.log(item_name, item_price_results, item_avg_price);

  let fetchedPrice;

  try {
    let res = await fetch(URL, {
      headers: {
        Origin: "https://www.walmart.com",
      },
    });

    // let's try convering the HTML string into a document, even though that's pretty damn wasteful
    let rawBody = await res.text();

    let { avgPrice } = convertToHTMLAndParse(rawBody);
    writePricetoJSON(item_name, avgPrice);
  } catch (e) {
    console.log(e);
    writePricetoJSON(item_name, 0);
    return;
  }

  fetchedPrice = retrieveCachedPrice(item_name);
  return fetchedPrice;
}

function convertToHTMLAndParse(resBody) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(resBody, "text/html");

  let itemDivs = Array.from(doc.querySelectorAll("div")).filter(
    (div) => div.getAttribute("data-automation-id") === "product-price"
  );

  let prices = itemDivs.map((div) => div.querySelector("span.w_CR").outerText);

  let priceValues = prices.map((priceStr) =>
    priceStr.replace(/[^0-9|^.]/gi, "")
  );

  let avgPrice = (
    priceValues.map((price) => parseFloat(price)).reduce((a, b) => a + b) /
    priceValues.length
  ).toFixed(2);

  return { avgPrice };
}

function writePricetoJSON(itemName, itemAvgPrice) {
  // in the short term, i'll use local storage
  // but this will be stored on a database soon
  let priceData = JSON.stringify({ itemName: itemAvgPrice });

  let currentData = localStorage.getItem("item-prices");

  if (currentData) {
    currentData = [...currentData, priceData];
  } else {
    currentData = priceData;
  }

  localStorage.setItem("item-prices", currentData);
}

function retrieveCachedPrice(itemName) {
  let storedPriceData = JSON.parse(localStorage.getItem("item-prices"));
  let storedAvgPrice = storedPriceData.itemName;
  return storedAvgPrice;
}

// walmart crawler notes
// when window page loads, if there are items:
// create an array of prices for each item
// only pulling from the first page of results, as this isn't a production app per se

// parseURL : walmart.com/search?q=${item_name}

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
