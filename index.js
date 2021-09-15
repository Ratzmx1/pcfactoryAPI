const express = require("express");
const fetchData = require("./fetchDiff");

const app = express();
const PORT = 5005;

app.use(express.json());

app.get("/diff", async (req, res) => {
  const diff = await fetchData();
  return res.json({ data: diff });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
