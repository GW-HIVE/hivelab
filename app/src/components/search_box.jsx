import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';


class Searchbox extends Component {
  
  render() {

    return (
        <div>
            <div className="leftblock" style={{width:"100%", fontSize:"14px"}}>
              Search by: BCOID, dataset file name, title, description or categories
            </div>
            <Paper component="form" elevation="0" className="searchbox_paper">
                
              <InputBase id="query" className="searchbox_input"  placeholder={this.props.placeholder} 
                    inputProps={{ 'aria-label': 'search zulasites', 
                    'style': {fontSize: "14px", color:"#777"}}}
                    onKeyPress={this.props.onKeyPress}
                    />          
                <div onClick={this.props.onSearch} className="material-icons search_icon">search</div>
                </Paper>
            </div>
    );
  }
}

export default Searchbox;
