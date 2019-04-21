import React from "react";
import { connect } from "react-redux";
import { Dimmer, StatsCard,Alert } from "tabler-react";

import { fetchItems, fetchLastItem } from "../redux/temperature";
import Chart from "./Chart";
import { movement, last } from "../utils";

class HumiditySensor extends React.Component {
  constructor(props) {
    super(props);

    this.fetchValues = this.fetchValues.bind(this);
    this.fetchLastValue = this.fetchLastValue.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchItems());

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
            total={`${last(values)} ℃`}
            label="Temperature"
            chart={
              <Chart
                name="Temperature"
                values={values}
                color="#e74c3c"
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
  items: state.temperature.items,
  loading: state.temperature.loading,
  error: state.temperature.error
});

export default connect(mapStateToProps)(HumiditySensor);
