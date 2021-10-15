const express = require("express");
const getCategories = require("./src/controllers/getCategories");
const getCategory = require("./src/controllers/getCategory");

const getDiff = require("./src/controllers/getDiff");
const fetchData = require("./src/helpers/fetchDiff");

// const app = express();
// const PORT = 5005;

// app.use(express.json());

// app.get("/diff", getDiff);
// app.get("/categories", getCategories);
// app.get("/categories/:key", getCategory);

// app.listen(PORT, () => {
//   console.log(`Listen on port ${PORT}`);
// });

fetchData();
