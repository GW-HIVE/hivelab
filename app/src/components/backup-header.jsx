import React, { Component } from "react";
//import Navbar from 'navbar-react'
//import { Container} from 'react-containers';
import { Form, FormControl, Container, Button, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';



class Header extends Component {

  


  render() {

    var navbarStyle =  { minHeight:"80px"}
    var server = process.env.REACT_APP_SERVER;
    //if (server !== "prd"){
    //  navbarStyle.backgroundImage = 'url("/imglib/watermark.'+server+'.png")';
    //}

    var headerLinks = [];
    headerLinks.push(<Nav.Link key={"link_xx"} href={"xxx"}>{"xxx"}</Nav.Link>)

    //for (var i in this.props.initObj.headerlinks){
    //  var obj = this.props.initObj.headerlinks[i];  
    //    headerLinks.push(<Nav.Link key={"link_" +obj.id} href={obj.url}>{obj.label}</Nav.Link>)
    //}
    

    return (
      <Navbar className="globalheader"  variant="dark" expand="lg" 
        style={navbarStyle}
        >
        <Container fluid>
          <Navbar.Brand href="/" style={{fontSize:"20px"}}>
            <img alt="" src={process.env.PUBLIC_URL + '/imglib/gw_logo.png'} 
                style={{width:"60px"}} /> 
            <img alt="" src={process.env.PUBLIC_URL + '/imglib/smhs_logo.png'}
                style={{width:"180px", margin:"0px 0px 0px 10px"}} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll style={{fontSize:"18px"}}>
              <NavDropdown title="About" id="navbarScrollingDropdown"
              >
                <NavDropdown.Item href="/static//workflow">Integration Workflow</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action6">
                  Data Version 1.1
                </NavDropdown.Item>
                <NavDropdown.Item href="#action6">
                  Website Version 1.1
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
