const express = require("express");
require("dotenv").config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    res.status(200).send({ msg: "Welcome to Alphabin-Weather-App" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// app.get("/weather", async (req, res) => {
//   try {
//     const city = req.query.city;
//     const apiKey = process.env.API_KEY;
//     const data = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
//     );
//     const out = await data.json();
//     res.status(201).json(out);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ error: error.message });
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is started at http://localhost:3000`);
});
