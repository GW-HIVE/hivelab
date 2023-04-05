import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Headerone from "./components/global/header_one";
import Footer from "./components/global/footer";
import Alertdialog from './components/global/dialogbox';
import Loadingicon from "./components/global/loading_icon";
import StaticPage from "./components/static_page";
import configObj from "./components/config.json";


class App extends Component {

  state = {
    module:"global",
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
<<<<<<< HEAD
=======
    var reqObj = {};
    const requestOptions = {
      method: 'GET', headers: { 'Content-Type': 'text/plain' }
    };
    const svcUrl = "/json/global/config.json";
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
>>>>>>> 0994d246ed6ee05bb99b0b154b19a3fc80d76bc5
  }


  render() {
    
  
    

    return (
      <div>
      <Alertdialog dialog={this.state.dialog} onClose={this.handleDialogClose}/>
      <Headerone config={configObj}/>
      <Router>
        <Switch>
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
