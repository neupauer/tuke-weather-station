import React from "react";
import { connect } from "react-redux";
import { StandaloneFormPage, FormCard, FormTextInput } from "tabler-react";
import { login } from "../redux/auth";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "admin",
      password: "000",
      error: null
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.setState({
      username: "",
      password: "",
      error: null
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { username, password } = this.state;

    this.setState({
      error: null
    });

    if (username === "admin" && password === "000") {
      this.props.dispatch(
        login({
          user: "admin",
          permission: 9999
        })
      );
    } else if (username === "operator" && password === "000") {
      this.props.dispatch(
        login({
          user: "operator",
          permission: 2000
        })
      );
    } else if (username === "worker" && password === "000") {
      this.props.dispatch(
        login({
          user: "worker",
          permission: 1000
        })
      );
    } else {
      this.setState({
        error: "These credentials do not match our records.",
        password: ""
      });
    }
  }

  onChange(name, value) {
    this.setState({
      [name]: value
    });
  }

  render() {
    const { username, password, error } = this.state;

    return (
      <StandaloneFormPage>
        <FormCard buttonText="Login" title="Login" onSubmit={this.onSubmit}>
          <FormTextInput
            name="email"
            label="Username"
            placeholder="admin"
            onChange={e => {
              this.onChange("username", e.target.value);
            }}
            value={username}
            error={error}
          />
          <FormTextInput
            name="password"
            type="password"
            label="Password"
            placeholder="000"
            onChange={e => {
              this.onChange("password", e.target.value);
            }}
            value={password}
          />
        </FormCard>
      </StandaloneFormPage>
    );
  }
}

export default connect()(LoginPage);
