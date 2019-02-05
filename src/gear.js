import React from "react";
import { Link } from "react-router-dom";
import { css } from "@emotion/core";
// First way to import
import { ClipLoader } from "react-spinners";

import {
  Container,
  Row,
  Col,
  Table,
  ListGroup,
  ListGroupItem
} from "reactstrap";

import { StravaComponent, ATHLETE_API, GEAR_API } from "./stravacomponent.js";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Gear extends StravaComponent {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      bike: null,
      selectedActivities: [],
      loading: true
    };

    this.gearLinkClickedHandler = this.gearLinkClickedHandler.bind(this);
  }

  render() {
    const user = this.state.user;

    if (user) {
      if (this.state.loading)
        return (
          <div className="sweet-loading">
            <ClipLoader
              css={override}
              sizeUnit={"px"}
              size={150}
              color={"#123abc"}
              loading={this.state.loading}
            />
          </div>
        );
      else
        return (
          <Container>
            <Row>
              <Col sm={{ size: "auto", offset: 0 }} xs="2">
                <ListGroup>
                  {user.bikes.map(item => (
                    <ListGroupItem key={item.id}>
                      <Link
                        to={"/geardetail/" + item.id}
                        onClick={() => this.gearLinkClickedHandler(item.id)}
                      >
                        {item.name}
                      </Link>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              </Col>
              <Col>
                <BikeDetail
                  bike={this.state.bike}
                  activities={this.state.selectedActivities}
                />
              </Col>
            </Row>
          </Container>
        );
    } else return null;
  }

  gearLinkClickedHandler(itemId) {
    this.callStravaAPI(GEAR_API + "/" + itemId, "bike");

    let selection = this.state.activities;

    if (selection) {
      selection = selection.filter(a => a.gear_id === itemId);
      this.setState({
        selectedActivities: selection
      });
    }
  }

  componentDidMount() {
    this.callStravaAPI(ATHLETE_API, "user");
    this.getAllActivities();
  }
}

class BikeDetail extends React.Component {
  render() {
    let bike = this.props.bike;
    let hours = this.props.activities.reduce((res, val) => {
      return (res += parseInt(val.moving_time) / 3600);
    }, 0);
    let kilometers = this.props.activities.reduce((res, val) => {
      return (res += parseInt(val.distance) / 1000);
    }, 0);

    if (bike)
      return (
        <div>
          {this.props.bike.name} logged {hours.toFixed(2)} hours and{" "}
          {kilometers.toFixed(0)} kilometers in {this.props.activities.length}{" "}
          activities.
          <ActivitiesTable activities={this.props.activities} />
        </div>
      );
    else return "";
  }
}

class ActivitiesTable extends React.Component {
  getHeartRate(a) {
    if (a.has_heartrate) {
      return a.average_heartrate;
    } else {
      return " ";
    }
  }

  render() {
    let activities = this.props.activities;

    return (
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Name</th>
            <th>Time</th>
            <th>Kilometers</th>
            <th>Watts</th>
            <th>HR</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(a => {
            console.log(JSON.stringify(a));
            return (
              <tr key={a.id}>
                <td>
                  <a
                    href={"https://www.strava.com/activities/" + a.id}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {a.id}
                  </a>
                </td>
                <td>{a.start_date_local.substring(0, 10)}</td>
                <td>{a.name}</td>
                <td>{(parseInt(a.moving_time) / 3600).toFixed(2)}</td>
                <td>{(parseInt(a.distance) / 1000).toFixed(0)}</td>
                <td>{parseInt(a.weighted_average_watts)}</td>
                <td>{parseInt(this.getHeartRate(a))}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default Gear;
