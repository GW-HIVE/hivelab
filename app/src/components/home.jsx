import React, { Component } from "react";
import * as LocalConfig from "./local_config";
import Loadingicon from "./loading_icon";
import Alertdialog from './dialogbox';
import $ from "jquery";


class Home extends Component {  
  
  state = {
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

  render() {
    return (
      <div>
        <Alertdialog dialog={this.state.dialog} onClose={this.handleDialogClose}/>
        <div className="pagecn">
        </div>
      </div>
    );
  }
}

export default Home;
