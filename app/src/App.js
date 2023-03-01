import React, { Component } from "react";
import StaticPage from "./components/static_page";
import Alertdialog from './components/dialogbox';
import Loadingicon from "./components/loading_icon";
import * as LocalConfig from "./components/local_config";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Headerone from "./components/header_one";
import Footer from "./components/footer";


class App extends Component {

  state = {
    menu:{},
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
    const svcUrl = "/json/menu.json";
    fetch(svcUrl, requestOptions).then((res) => res.json()).then(
        (result) => {
          var tmpState = this.state;
          tmpState.menu = result;
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
      <Headerone menu={this.state.menu}/>
      <Router>
        <Switch>
          <Route
            path="/:pageId"
            render={(props) => (
              <StaticPage menu={this.state.menu} pageId={props.match.params.pageId}/>
            )}
          />
          <Route
            exact
            path="/"
            render={(props) => (
              <StaticPage menu={this.state.menu} pageId={"home"}/>
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
