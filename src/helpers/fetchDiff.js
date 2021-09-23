const puppeteer = require("puppeteer");
const fs = require("fs");
const _ = require("lodash");

var page;

// puppeteer
//   .launch()
//   .then((b) => b.newPage())
//   .then((p) => (page = p)); // dev

puppeteer // prod
  .launch({
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox"],
  })
  .then((b) => b.newPage())
  .then((p) => (page = p)); // prod

const fetchData = async () => {
  const data = {};

  try {
    await page.goto("https://www.pcfactory.cl/liquidacion", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(1000);

    const dataIdList = await page.$$eval(".container div", (data) => {
      const a = data.map((e) => e.getAttribute("data-id"));
      return a.filter((e) => e != null);
    });

    for (const id in dataIdList) {
      // console.log(id, dataIdList[id]);
      const element = dataIdList[id];
      const cantidadProductos = await page.$eval(
        `div[data-id="${element}"] div.product-filters__heading h4.link.color-primary-1 span:nth-child(2)`,
        (e) => {
          return e.textContent;
        }
      );

      console.log(element, cantidadProductos);
      const el = [];
      for (
        let pageIndex = 1;
        pageIndex < Math.ceil(cantidadProductos / 48) + 1;
        pageIndex++
      ) {
        await page.goto(
          `https://www.pcfactory.cl${element}?pagina=${pageIndex}&orden=2`,
          {
            waitUntil: "domcontentloaded",
          }
        );

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

        for (const i in productList) {
          const name = productList[i];
          const price = priceList[i];
          const image = imageList[i];
          const url = urlList[i];
          el.push({ name, price, image, url });
        }
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
      }
    }

    fs.writeFileSync("db.json", JSON.stringify(data), "utf-8");
  } catch (error) {
    console.log(`Internal Error ${error.message}`);
  }

  // await page.close();
  // await browser.close();
  return diffList;
};

module.exports = fetchData;
