const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const PORT = process.env.VUE_APP_PORT || 3000;

app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

// if (process.env.NODE_ENV === "production") {
//static folder
app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(process.cwd(), "public")));

// app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
// }

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "Everthing looks good",
  });
});

app.get("/stock/stockSearch", async (req, res) => {
  const timeSeries = req.query.function;
  const symbol = req.query.symbol;
  const searchUrl = `https://alpha-vantage.p.rapidapi.com/query?function=${timeSeries}&symbol=${symbol}&datatype=json`;
  const options = {
    method: "GET",

    headers: {
      "X-RapidAPI-Key": process.env.VUE_APP_API_KEY,
      "X-RapidAPI-Host": "alpha-vantage.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(searchUrl, options);
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).send({
      msg: "Server error",
    });
  }
});

app.use(function (req, res, next) {
  // res.sendFile(path.join(process.cwd(), "public", "index.html"));
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
