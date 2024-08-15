import React, { Component } from "react";
import Searchbox from "./biomuta_searchbox";
import SearchResults from "./biomuta_SearchResults";
import PlotComponent from "./biomuta_plot";
import $ from "jquery";
class DatasetPage extends Component {
  state = {
    searchResults: [],
    plotData1: [],
    plotData2: [],
  };

  handleSearch = (results) => {
    const queryValue = $("#query").val() || "";
    fetch("/getProteinData", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fieldvalue: queryValue })
    })
    .then((res) => res.json())
    .then(
      (result) => {
        if (result.taskStatus === 1) {
          this.setState({
            searchResults: results,
            plotData1: result.plotdata1,
            plotData2: result.plotdata2,
          });
        } else {
          alert(result.errorMsg);
        }
      },
      (error) => {
        console.error("Error fetching protein data:", error);
      }
    );
  };

  render() {
    return (
      <div className="dataset-page">
        <div className="search-container">
          <Searchbox 
            placeholder="Search a protein"
            onSearch={this.handleSearch}
          />
        </div>
        <div className="search-results-container">
          <SearchResults 
            results={this.state.searchResults}
            onSearch={this.handleSearch}
          />
        </div>
        <div className="plot-container">
          <PlotComponent plotData={this.state.plotData1} title="Cancer Type vs. Frequency" />
          <PlotComponent plotData={this.state.plotData2} title="Position vs. Frequency" chartType="LineChart" />
        </div>
      </div>
    );
  }
}

export default DatasetPage;
