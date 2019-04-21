import React from "react";
import { connect } from "react-redux";
import { Error404Page, Site, Nav } from "tabler-react";
import { createHistory, LocationProvider, Router, Link } from "@reach/router";
import { logout } from "./redux/auth";

let history = createHistory(window);

// --- PAGES ---
import DashboardPage from "./pages/DashboardPage";
import HumidityPage from "./pages/HumidityPage";
import TemperaturePage from "./pages/TemperaturePage";
import PressurePage from "./pages/PressurePage";

import LoginPage from "./pages/LoginPage";

const NotFoundPage = () => <Error404Page />;
// --- END PAGES ---

const routes = [
  {
    name: "Dashboard",
    path: "/",
    icon: "activity",
    permission: 0
  },
  {
    name: "Humidity",
    path: "humidity",
    permission: 1000
  },
  {
    name: "Temperature",
    path: "temperature",
    permission: 2000
  },
  {
    name: "Pressure",
    path: "pressure",
    permission: 3000
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { user, permission } = this.props.auth;

    if (!user) {
      return <LoginPage />;
    }

    return (
      <LocationProvider history={history}>
        <Site.Wrapper
          headerProps={{
            href: "#",
            imageURL: "img/logo.svg",
            alt: "Weather Station Dashboard",
            accountDropdown: {
              name: user,
              description: permission,
              options: [{ icon: "log-out", value: "Log out", to: "/" }]
            }
          }}
          navProps={{
            items: routes
              .filter(route => permission >= route.permission)
              .map(route => (
                <Nav.Item
                  value={route.name}
                  icon={route.icon || null}
                  to={route.path}
                  key={route.path}
                  LinkComponent={Link}
                />
              ))
          }}
          footerProps={{
            copyright: "Peter Neupauer - Technical University of Košice"
          }}
        >
          <Router>
            <DashboardPage path="/" />
            <HumidityPage path="/humidity" />
            {permission >= 2000 && <TemperaturePage path="/temperature" />}
            {permission >= 3000 && <PressurePage path="/pressure" />}
            <NotFoundPage default />
          </Router>
        </Site.Wrapper>
      </LocationProvider>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(App);
