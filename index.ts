import axios from "axios";
import dotenv from "dotenv";
import express from "express";

const app = express();
dotenv.config();
const port = process.env.PORT;

app.get("/", async (req, res) => {
  const url = process.env.NASA_API_URL!;
  // .append() HttpParams?
  const { data } = await axios.get(
    `${url}?api_key=${process.env.NASA_API_KEY}`
  );
  console.log(data);
  res.send(data);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
