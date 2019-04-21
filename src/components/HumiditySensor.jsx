import React from "react";
import { connect } from "react-redux";
import { Alert, Dimmer, StatsCard } from "tabler-react";

import { fetchItems, fetchLastItem } from "../redux/humidity";
import Chart from "./Chart";
import { movement, last } from "../utils";

class HumiditySensor extends React.Component {
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
            total={`${last(values)} %`}
            label="Humidity"
            chart={
              <Chart
                name="Humidity"
                values={values}
                color="#3498db"
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
  items: state.humidity.items,
  loading: state.humidity.loading,
  loadingLast: state.humidity.loadingLast,
  error: state.humidity.error
});

export default connect(mapStateToProps)(HumiditySensor);
