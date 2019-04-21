import React from "react";
import { Page, Grid } from "tabler-react";
import HumiditySensor from "../components/HumiditySensor";
import Alarms from "../components/Alarms";

class HumidityPage extends React.Component {
  render() {
    return (
      <Page.Content title="Humidity">
        <Grid.Row>
          <Grid.Col>
            <HumiditySensor limit={1000}/>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Alarms predicate={item => item.name === "HUMIDITY"} />
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    );
  }
}

export default HumidityPage;
