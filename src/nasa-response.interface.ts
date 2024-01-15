export interface CloseApproach {
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

export interface EstimatedDiameter {
  estimated_diameter_max: number;
  estimated_diameter_min: number;
}

export interface Asteroid {
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

export interface NEO {
  [date: string]: Array<Asteroid>;
}

export interface NASAResponse {
  element_count: number;
  links: {
    next: string;
    prevoius: string;
    self: string;
  };
  near_earth_objects: NEO;
}
