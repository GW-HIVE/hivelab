import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Headerone from "./components/global/header_one";
import Footer from "./components/global/footer";
import StaticPage from "./components/static_page";
import SearchResults from "./components/biomuta_SearchResults";  // Import the SearchResults component
import DatasetPage from "./components/Proteinview_dataset_page"; // Import the Biomuta DatasetPage component
import TranscriptDatasetPage from "./components/Geneview_dataset_page";
import configObj from "./components/global/config.json";
import GalleryPage from "./components/GalleryPage";
import BiomutaParentPage from "./components/BiomutaParentPage";
import bioxpressParentPage from "./components/bioxpressParentPage";

class App extends Component {
  render() {
    return (
      <div>
        <Headerone config={configObj} />
        <Router>
          <Switch>
            
          {/* Protein Dataset Page - Using the canonicalAc from the URL */}
          <Route path="/biomuta/proteinview/:canonicalAc" component={DatasetPage} />
          {/* Handle the case where the query parameter gene is present */}
          <Route path="/biomuta/proteinview" component={DatasetPage} />
          <Route path="/bioxpress/transcriptView/:canonicalAc" component={TranscriptDatasetPage} />
          {/* Gallery Page */}
          /* <Route path="/gallery" component={GalleryPage} /> */
          {/* BioMuta Parent Page */}
          <Route path="/biomuta" component={BiomutaParentPage} />
          <Route path="/bioxpress" component={bioxpressParentPage} />
            <Route
              path="/:pageId"
              render={(props) => (
                <StaticPage
                  config={configObj}
                  pageId={props.match.params.pageId}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={(props) => (
                <StaticPage config={configObj} pageId={"home"} />
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
