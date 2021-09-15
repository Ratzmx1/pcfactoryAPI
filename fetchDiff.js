const puppeteer = require("puppeteer");
const fs = require("fs");
const _ = require("lodash");

const fetchData = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const data = {};
  const diff = {};

  try {
    await page.goto("https://www.pcfactory.cl/liquidacion", {
      waitUntil: "domcontentloaded",
    });
    page.waitForTimeout(1000);

    const dataIdList = await page.$$eval(".container div", (data) => {
      const a = data.map((e) => e.getAttribute("data-id"));
      return a.filter((e) => e != null);
    });

    for (const id in dataIdList) {
      const element = dataIdList[id];

      const productList = await page.$$eval(
        `div[data-id="${element}"] .product .product__card-title`,
        (data) => {
          return data.map((e) => e.textContent);
        }
      );

      const priceList = await page.$$eval(
        `div[data-id="${element}"] .product div.product__price div .title-md`,
        (data) => {
          return data.map((e) => e.textContent);
        }
      );

      const imageList = await page.$$eval(
        `div[data-id="${element}"] .product div.product__image img`,
        (data) => {
          return data.map(
            (e) => `https://www.pcfactory.cl${e.getAttribute("src")}`
          );
        }
      );

      const urlList = await page.$$eval(
        `div[data-id="${element}"] .product div.product__image a`,
        (data) => {
          return data.map(
            (e) => `https://www.pcfactory.cl${e.getAttribute("href")}`
          );
        }
      );

      const el = [];

      for (const i in productList) {
        const name = productList[i];
        const price = priceList[i];
        const image = imageList[i];
        const url = urlList[i];
        el.push({ name, price, image, url });
      }

      data[element.replace("/liq-", "").toUpperCase()] = el;
    }
    const db = JSON.parse(fs.readFileSync("db.json", "utf-8"));
    var diffList = [];
    for (const j in Object.keys(data)) {
      const key = Object.keys(data)[j];
      const thisDiff = _.differenceBy(data[key], db[key], "name");

      if (thisDiff.length > 0) {
        diffList = _.concat(diffList, thisDiff);
        // diff[key] = thisDiff;
      }
    }

    fs.writeFileSync("db.json", JSON.stringify(data), "utf-8");
  } catch (error) {
    console.log(`Internal Error ${error.message}`);
  }

  await page.close();
  await browser.close();
  return diffList;
};

module.exports = fetchData;
