import axios from "axios";
import dotenv from "dotenv";
import express from "express";
import querystring from "node:querystring";
import { URL } from "node:url";

const app = express();
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

interface CloseApproach {
  close_approach_date: string;
  close_approach_date_full: string;
  epoch_date_close_approach: number;
  miss_distance: {
    astronomical: string;
    kilometers: string;
    lunar: string;
    miles: string;
  };
  orbiting_body: string;
  relative_velocity: {
    kilometers_per_hour: string;
    kilometers_per_second: string;
    miles_per_hours: string;
  };
}

interface EstimatedDiameter {
  estimated_diameter_max: number;
  estimated_diameter_min: number;
}

interface Asteroid {
  absolute_magnitute_h: number; // what's float?
  estimated_diameter: {
    feet: EstimatedDiameter;
    kilometers: EstimatedDiameter;
    meters: EstimatedDiameter;
    miles: EstimatedDiameter;
  };
  close_approach_data: Array<CloseApproach>;
  id: string;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  links: {
    self: string;
  };
  name: string;
  nasa_jpl_url: string;
  neo_reference_id: string;
}

interface NEO {
  [date: string]: Array<Asteroid>;
}

interface NASAResponse {
  element_count: number;
  links: {
    next: string;
    prevoius: string;
    self: string;
  };
  near_earth_objects: NEO;
}

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

  keys.forEach((day) => {
    near_earth_objects[day].forEach((asteroid) => {
      const miss_distance =
        asteroid.close_approach_data[0].miss_distance.kilometers;
      console.log(miss_distance);
      // console.log(asteroid.name);
    });
  });

  res.send(data);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
