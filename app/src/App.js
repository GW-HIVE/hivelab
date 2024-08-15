import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Headerone from "./components/global/header_one";
import Footer from "./components/global/footer";
import Loadingicon from "./components/global/loading_icon";
import StaticPage from "./components/static_page";
import DatasetPage from "./components/Proteinview_dataset_page"; // Import the Biomuta DatasetPage component
import configObj from "./components/global/config.json";


class App extends Component {
  render() {
    return (
      <div>
        <Headerone config={configObj}/>
        <Router>
          <Switch>
            <Route
              path="/biomuta"
              render={(props) => (
                <DatasetPage /> // Render the DatasetPage for the search route
              )}
            />
            <Route
              path="/:pageId"
              render={(props) => (
                <StaticPage config={configObj} pageId={props.match.params.pageId}/>
              )}
            />
            <Route
              exact
              path="/"
              render={(props) => (
                <StaticPage config={configObj} pageId={"home"}/>
              )}
            />
          </Switch>
        </Router>
        <Footer />
      </div>
    );
  }
}

export default App;