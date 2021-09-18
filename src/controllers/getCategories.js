const fs = require("fs");
const { capitalize } = require("lodash");

const getCategories = (req, res) => {
  const db = fs.readFileSync("db.json");
  const data = Object.keys(JSON.parse(db)).map((e) => ({
    label: capitalize(e),
    value: e,
  }));

  return res.json({ data });
};

module.exports = getCategories;
