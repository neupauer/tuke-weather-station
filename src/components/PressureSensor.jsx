import React from "react";
import { connect } from "react-redux";
import { Alert, Dimmer, StatsCard } from "tabler-react";

import { fetchItems, fetchLastItem } from "../redux/pressure";
import Chart from "./Chart";
import { movement, last } from "../utils";

class PressureSensor extends React.Component {
  constructor(props) {
    super(props);

    this.fetchValues = this.fetchValues.bind(this);
    this.fetchLastValue = this.fetchLastValue.bind(this);
  }

  componentDidMount() {
    this.fetchValues();

    this.interval = setInterval(this.fetchLastValue, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchValues() {
    this.props.dispatch(fetchItems());
  }

  fetchLastValue() {
    if (!this.props.loadingLast) {
      this.props.dispatch(fetchLastItem());
    }
  }

  render() {
    const { error, loading, items, limit } = this.props;
    const values = items.map(item => item.value);

    return (
      <React.Fragment>
        {error && (
          <Alert type="danger" icon="alert-triangle" isDismissible>
            {error}
          </Alert>
        )}
        <Dimmer active={loading} loader>
          <StatsCard
            layout={2}
            movement={movement(values)}
            total={`${last(values)} hPa`}
            label="Pressure"
            chart={
              <Chart
                name="Pressure"
                values={values}
                color="#2ecc71"
                limit={limit}
              />
            }
          />
        </Dimmer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  items: state.pressure.items,
  loading: state.pressure.loading,
  loadingLast: state.pressure.loadingLast,
  error: state.pressure.error
});

export default connect(mapStateToProps)(PressureSensor);
