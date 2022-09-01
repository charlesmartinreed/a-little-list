import { BSONSymbol } from "bson";
import * as dotenv from "dotenv";
dotenv.config();

import router from "express";
import { rmSync } from "fs";
import fetch from "node-fetch";
const app = router();

const PORT = 6500;

app.get("/", async (req, res) => {
  let result = await fetchWebsiteResult("https://www.github.com/");

  if (result) {
    res.send(result);
  } else {
    res.send("Unable to fetch page results");
  }

  // res.send(fetchWebsiteResult("https://www.github.com/"));
  // res.send("hello world");
});

const fetchWebsiteResult = async (URL) => {
  try {
    const res = await fetch(URL);
    const body = await res.text();
    return body;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

app.listen(PORT, () => console.log(`server now running on PORT ${PORT}`));
