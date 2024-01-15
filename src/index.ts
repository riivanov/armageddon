import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import { DateTime } from "luxon";
import querystring from "node:querystring";
import { URL } from "node:url";
import { errorHandler } from "./middleware/error-handler";
import { Asteroid, NASAResponse, NEO } from "./nasa-response.interface";
import { tryCatch } from "./utils/try-catch";

const app = express();
app.use(express.json());
dotenv.config();
const port = process.env.PORT;

//  https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
app.post(
  `/`,
  tryCatch(async (req: any, res: any) => {
    const { body } = req;
    // if no body
    if (!body) throw new Error(`POST request without a body`);

    const { dateStart, dateEnd } = body;
    const {
      within: { value: maxAsteroidRange },
    } = body;
    // if no start/end
    if (!dateStart) throw new Error(`dateStart is a required field`);
    if (!dateEnd) throw new Error(`dateEnd is a required field`);
    if (!maxAsteroidRange || maxAsteroidRange < 0)
      throw new Error(`within->value must be > 0`);

    console.log(maxAsteroidRange);

    const start = DateTime.fromFormat(dateStart, `yyyy-MM-dd`);
    const end = DateTime.fromFormat(dateEnd, `yyyy-MM-dd`);
    // if not valid format
    if (!start.isValid)
      throw new Error(`Start Date Invalid ${start.invalidExplanation}`);
    if (!end.isValid)
      throw new Error(`End Date Invalid ${end.invalidExplanation}`);

    const url = new URL(process.env.NASA_API_URL!);
    const queryParams = {
      api_key: process.env.NASA_API_KEY,
      start_date: start.toISODate(),
      end_date: end.toISODate(),
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

          return Number(miss_distance) <= maxAsteroidRange;
        })
      );
    }

    res.json(dangerous);
  })
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
