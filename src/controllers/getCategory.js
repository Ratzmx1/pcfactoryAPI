const fs = require("fs");
const _ = require("lodash");

const getCategories = (req, res) => {
  const key = req.params.key;
  const db = fs.readFileSync("db.json");
  const data = JSON.parse(db);
  return res.json({ data: _.chunk(data[key], 10) });
};

module.exports = getCategories;
