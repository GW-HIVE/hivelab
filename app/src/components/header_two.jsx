import React, { Component } from "react";
import Loadingicon from "./loading_icon";
import {Container,Navbar, Nav, NavItem, NavDropdown, MenuItem }   from 'react-bootstrap';
import $ from "jquery";



class Backendheader extends Component {

  state = {
    menu:{},
    isLoaded:false
  }
  
  getNavLinks = () => {
    var linkList = []
    
    var obj = {"label":"HOME", "url":"/"}
    linkList.push(<a className="reglinkblue" href={obj.url}>{obj.label}</a>)
    if (this.props.pageId !== "home"){
      for (var i in this.props.menu){
        var obj = this.props.menu[i];
        if (obj.id === this.props.pageId){
          linkList.push(<span> / </span>);
          linkList.push(<a className="reglinkblue" href={obj.url}>{obj.label}</a>)
          break;
        }
      }
    }
    return linkList;

  }

  render() {

    var navLinks = this.getNavLinks();

    var sList = [
      {width:"80%", margin:"40px 10% 0px 10%"},
      {width:"60%", color:"#033C5A", fontSize:"30px",fontWeight:"bold"},
      {width:"60%", fontSize:"12px",fontWeight:"normal"},
      {width:"40%", color:"#033C5A", fontSize:"14px", textAlign:"right"},
      {width:"60px"}
    ];
    return (
      <div className="leftblock" style={sList[0]}>
        <div class="leftblock" style={sList[1]}> 
          The HIVE Lab<br/>
          <div className="leftblock" style={sList[2]}>
            {navLinks}
          </div>
        </div>
        <div class="leftblock" style={sList[3]}> 
          <img alt="" src={'/imglib/hive_logo.png'} style={sList[4]}/> <br/>
          High-performance Integrated Virtual Environment
        </div>
      </div>
    );

  }
}





export default Backendheader;
