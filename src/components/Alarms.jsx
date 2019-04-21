import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { Table, Header, Icon, Button } from "tabler-react";
import { doneAlarm } from "../redux/alarm";

class Alarms extends React.Component {
  constructor(props) {
    super(props);

    this.renderBold = this.renderBold.bind(this);
    this.renderBoldValue = this.renderBoldValue.bind(this);
  }

  renderBold(item) {
    if (item.level === "HiHi" || item.level === "LoLo") {
      return !item.done;
    }

    return false;
  }

  renderBoldValue(item, value) {
    if (this.renderBold(item)) {
      return <strong className="text-danger">{value}</strong>;
    }

    return value;
  }

  render() {
    const { alarm, predicate } = this.props;

    return (
      <React.Fragment>
        <Header.H6>Alarms</Header.H6>
        {this.props.alarm.items.length > 0 && (
          <Table>
            <Table.Header>
              <Table.ColHeader>ID</Table.ColHeader>
              <Table.ColHeader>Sensor</Table.ColHeader>
              <Table.ColHeader>Value</Table.ColHeader>
              <Table.ColHeader>Level</Table.ColHeader>
              <Table.ColHeader />
            </Table.Header>
            <Table.Body>
              {_.sortBy(alarm.items, ["id"])
                .reverse()
                .filter(item => (predicate ? predicate(item) : true))
                .map(item => (
                  <Table.Row key={item.id}>
                    <Table.Col>
                      <span className="text-muted">{item.id}</span>
                    </Table.Col>
                    <Table.Col>
                      {this.renderBoldValue(item, item.name)}
                    </Table.Col>
                    <Table.Col>
                      {this.renderBoldValue(item, item.value)}
                    </Table.Col>
                    <Table.Col>
                      {this.renderBoldValue(item, item.level || null)}
                    </Table.Col>
                    <Table.Col>
                      {this.renderBold(item) ? (
                        <Button
                          size="sm"
                          icon="check"
                          onClick={() => {
                            this.props.dispatch(doneAlarm(item));
                          }}
                        >
                          OK
                        </Button>
                      ) : null}
                    </Table.Col>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alarm: state.alarm
});

export default connect(mapStateToProps)(Alarms);
