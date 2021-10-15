const { chunk } = require("lodash");
const fetchData = require("../helpers/fetchDiff");

const getDiff = async (req, res) => {
  const diff = await fetchData();
  return res.json({ data: chunk(diff, 10) });
};

module.exports = getDiff;
