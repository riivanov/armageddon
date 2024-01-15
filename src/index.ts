import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import { DateTime } from "luxon";
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
  const { body } = req;
  // if no body
  if (!body) res.status(400).send(`POST request without a body`);

  const { dateStart, dateEnd } = body;
  // if no start/end
  if (!dateStart) res.status(400).send(`dateStart is a required field`);
  if (!dateEnd) res.status(400).send(`dateEnd is a required field`);

  const start = DateTime.fromFormat(dateStart, `yyyy-MM-dd`);
  const end = DateTime.fromFormat(dateEnd, `yyyy-MM-dd`);
  // if not valid format
  if (!start.isValid)
    res.status(400).send(`Start Date Invalid ${start.invalidExplanation}`);
  if (!end.isValid)
    res.status(400).send(`End Date Invalid ${end.invalidExplanation}`);

  res.json(body);
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
