import React from "react";
import { Page, Grid } from "tabler-react";
import PressureSensor from "../components/PressureSensor";
import Alarms from "../components/Alarms";

class PressurePage extends React.Component {
  render() {
    return (
      <Page.Content title="Pressure">
        <Grid.Row>
          <Grid.Col>
            <PressureSensor limit={1000} />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Alarms predicate={item => item.name === "PRESSURE"} />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    );
  }
}

export default PressurePage;
