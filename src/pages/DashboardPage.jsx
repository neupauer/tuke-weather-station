import React, { Component } from "react";
import { connect } from "react-redux";
import { Page, Grid } from "tabler-react";
import HumiditySensor from "../components/HumiditySensor";
import TemperatureSensor from "../components/TemperatureSensor";
import PressureSensor from "../components/PressureSensor";
import Alarms from "../components/Alarms";

class DashboardPage extends Component {
  componentDidMount() {}

  render() {
    const { permission } = this.props.auth;

    return (
      <Page.Content title="Dashboard">
        <Grid.Row>
          {permission >= 1000 && (
            <Grid.Col>
              <HumiditySensor limit={20} />
            </Grid.Col>
          )}
          {permission >= 2000 && (
            <Grid.Col>
              <TemperatureSensor limit={20} />
            </Grid.Col>
          )}
          {permission >= 3000 && (
            <Grid.Col>
              <PressureSensor limit={20} />
            </Grid.Col>
          )}
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Alarms
              predicate={alarm => {
                if (permission >= 3000) {
                  return true;
                } else if (permission >= 2000) {
                  return (
                    alarm.name === "HUMIDITY" || alarm.name === "TEMPERATURE"
                  );
                } else if (permission >= 1000) {
                  return alarm.name === "HUMIDITY";
                }
              }}
            />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(DashboardPage);
