import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import querystring from "node:querystring";
import { URL } from "node:url";
import { Asteroid, NASAResponse, NEO } from "./nasa-response.interface";

const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT;

const mockReq = {
  dateStart: "2019-01-01",
  dateEnd: "2019-01-07",
  within: {
    value: 9000000,
    units: "kilometers",
  },
};

app.post(`/`, async (req, res) => {
  res.json(req.body);
});

//  https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
app.get("/", async (req, res) => {
  const url = new URL(process.env.NASA_API_URL!);
  const queryParams = {
    api_key: process.env.NASA_API_KEY,
  };
  url.search = querystring.encode(queryParams);

  const { data } = await axios.get<NASAResponse>(url.href);
  const near_earth_objects = data.near_earth_objects as NEO;

  const keys = Object.keys(near_earth_objects).sort();

  let dangerous: Asteroid[] = [];
  for (const day of keys) {
    dangerous.push(
      ...near_earth_objects[day].filter((asteroid) => {
        const miss_distance =
          asteroid.close_approach_data[0].miss_distance.kilometers;

        return Number(miss_distance) <= mockReq.within.value;
      })
    );
  }

  res.send(dangerous);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
