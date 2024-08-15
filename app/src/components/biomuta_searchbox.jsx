import React from "react";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';

class Searchbox extends React.Component {
  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.props.onSearch();  // Trigger the search when Enter is pressed
    }
  };

  render() {
    return (
      <div>
        <div className="leftblock" style={{width:"100%", fontSize:"14px"}}>
          Search by: Gene Name, Accession, or Protein ID
        </div>
        <Paper component="form" elevation={0} className="searchbox_paper">
          <InputBase 
            id="query" 
            className="searchbox_input"  
            placeholder={this.props.placeholder} 
            inputProps={{ 
              'aria-label': 'search proteins', 
              'style': {fontSize: "14px", color:"#777"} 
            }}
            onKeyPress={this.handleKeyPress} // Handle Enter key press
          />          
          <div 
            onClick={this.props.onSearch}  // Trigger the search on click
            className="material-icons search_icon">
            search
          </div>
        </Paper>
      </div>
    );
  }
}

export default Searchbox;
