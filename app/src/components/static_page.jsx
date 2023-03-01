import React, { Component } from "react";
import Alertdialog from './dialogbox';
import Loadingicon from "./loading_icon";
import { Markup } from 'interweave';
import Headertwo from "./header_two";
import $ from "jquery";


class StaticPage extends Component {
  
  state = {
    html:"",
    isLoaded:false,
    resflag:0,
    dialog:{
      status:false, 
      msg:""
    }
  };

   componentDidMount() {
    var reqObj = {};
    const requestOptions = {
      method: 'GET', headers: { 'Content-Type': 'text/html' }
    };
    const svcUrl = "/html/page."+this.props.pageId +".html";


    fetch(svcUrl, requestOptions).then((res) => res.text()).then(
        (result) => {
          console.log("Result:",result);
          var tmpState = this.state;
          tmpState.isLoaded = true;
          if(result.indexOf("!DOCTYPE") !== -1){
            tmpState.dialog.status = true;
            tmpState.dialog.msg = "Page=" + this.props.pageId + " does NOT exist!";
          }
          else{
            tmpState.html = result;
          }
          this.setState(tmpState);
        },
        (error) => {
          console.log("Error:", error);
        }
    );
  }

  

  handleDialogClose = () => {
    var tmpState = this.state;
    tmpState.dialog.status = false;
    this.setState(tmpState);
    window.location.href = "/";
  }



  render() {

    if (this.state.isLoaded === false){
      return <Loadingicon/>
    }

    return (
      <div>
        <Headertwo menu={this.props.menu} pageId={this.props.pageId}/>
        <Alertdialog dialog={this.state.dialog} onClose={this.handleDialogClose}/>
        <div className="pagecnwrapper">
          <div className="pagecn">
            <Markup content={this.state.html}/>
          </div>
          <div className="advcn">
            <img alt="" src={'/imglib/smhs_magazine.png'}/> <br/>
            <a className="reglinkblue" href="https://biochemistry.smhs.gwu.edu/">
              <br/>
              Visit the Department of Biochemistry and Molecular Medicine
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default StaticPage;
