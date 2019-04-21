import React from "react";
import { Page, Grid } from "tabler-react";
import TemperatureSensor from "../components/TemperatureSensor";
import Alarms from "../components/Alarms";

class TemperaturePage extends React.Component {
  render() {
    return (
      <Page.Content title="Temperature">
        <Grid.Row>
          <Grid.Col>
            <TemperatureSensor limit={1000} />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Alarms predicate={item => item.name === "TEMPERATURE"} />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    );
  }
}

export default TemperaturePage;
