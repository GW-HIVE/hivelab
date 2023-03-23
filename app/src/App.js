import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Headerone from "./components/global/header_one";
import Footer from "./components/global/footer";
import Alertdialog from './components/global/dialogbox';
import Loadingicon from "./components/global/loading_icon";
import StaticPage from "./components/static_page";



class App extends Component {

  state = {
    module:"global",
    config:{},
    isLoaded:false,
    dialog:{
      status:false, 
      msg:""
    }
  };

  handleDialogClose = () => {
    var tmpState = this.state;
    tmpState.dialog.status = false;
    this.setState(tmpState);
  }

  componentDidMount() {
    var reqObj = {};
    const requestOptions = {
      method: 'GET', headers: { 'Content-Type': 'text/plain' }
    };
    const svcUrl = "/ln2data/json/global/config.json";
    fetch(svcUrl, requestOptions).then((res) => res.json()).then(
        (result) => {
          var tmpState = this.state;
          tmpState.config = result;
          tmpState.isLoaded = true;
          this.setState(tmpState);
          //console.log("Result:", result);
        },
        (error) => {
          console.log("Error:", error);
        }
    );
  }


  render() {
    
  
    if (this.state.isLoaded === false){
      return <Loadingicon/>
    }



    return (
      <div>
      <Alertdialog dialog={this.state.dialog} onClose={this.handleDialogClose}/>
      <Headerone config={this.state.config}/>
      <Router>
        <Switch>
          <Route
            path="/:pageId"
            render={(props) => (
              <StaticPage config={this.state.config} pageId={props.match.params.pageId}/>
            )}
          />
          <Route
            exact
            path="/"
            render={(props) => (
              <StaticPage config={this.state.config} pageId={"home"}/>
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
