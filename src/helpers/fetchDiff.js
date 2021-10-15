const fs = require("fs");
const { spawn } = require("child_process");
const _ = require("lodash");

function getData() {
  return new Promise((resolve, reject) => {
    const process = spawn("python", ["./src/helpers/scrapp.py"]);
    const out = [];
    process.stdout.on("data", (data) => {
      out.push(data.toString());
    });

    process.on("exit", (code, signal) => {
      resolve(out);
    });
  });
}

const fetchData = async () => {
  try {
    const dataS = await getData();
    const datass = JSON.stringify(dataS[0]);

    const data = JSON.parse(
      _.replace(datass, new RegExp("'", "g"), '"').substring(
        1,
        datass.length - 3
      )
    );
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

  return diffList;
};

const a = async () => {
  const data = await fetchData();
  console.log(data);
};

a();

// module.exports = fetchData;
