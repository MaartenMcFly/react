import React from "react";

const STRAVA_API = "https://www.strava.com/api/v3/";
const STRAVA_TOKEN = "";
const headers = { Authorization: "Bearer " + STRAVA_TOKEN };

export const ATHLETE_API = STRAVA_API + "athlete";
export const ACTIVITIES_API = ATHLETE_API + "/activities";
export const GEAR_API = STRAVA_API + "gear";

export class StravaComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
      loading: true
    };
    this.updateActivities = this.updateActivities.bind(this);
  }
  componentDidMount() {
    this.getAllActivities();
  }

  callStravaAPI = (api, field) => {
    fetch(api, { headers })
      .then(response => response.json())
      .then(data => this.setState({ [field]: data }));
  };

  updateActivities(activities) {
    this.setState({ activities: activities, loading: false });
  }

  getAllActivities = () => {
    let opts = {
      page: 1,
      perPage: 100
    };

    let getNextPage = (page, result, updateActivities) => {
      let queryString =
        ACTIVITIES_API + "?page=" + page + "&per_page=" + opts.perPage;

      fetch(queryString, {
        headers
      })
        .then(response => response.json())
        .then(data => {
          if (result) {
            result = result.concat(data);
          } else {
            result = data;
          }
          if (data.length === opts.perPage) {
            getNextPage(page + 1, result, updateActivities);
          } else updateActivities(result);
        });
    };

    getNextPage(opts.page, null, this.updateActivities);
  };
}
export default StravaComponent;
