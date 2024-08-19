
/*
ProteinDatasetPage Component
Purpose: Handles rendering detailed datasets for specific proteins.
Related Backend Scripts: getProteinData.py, checkAccession.py

This component should render detailed datasets returned by the getProteinData API endpoint.
Implement features like sorting, filtering, and pagination for large datasets.
Provide options to download the dataset or view additional details in a modal or a separate view.
*/
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
    fetch("/api/getProteinData", {
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
        {/* Introduction and Information Section */}
        <div className="info-section">
          <h2>BioMuta Protein Dataset Search</h2>
          <p>
            Use this tool to search for detailed protein datasets by Gene Name, Accession Number, or Protein ID.
            Enter your query in the search box below to retrieve relevant data.
          </p>
          <p>
            <strong>Example Queries:</strong> KRAS, BRCA1, Q9P1W8-1
          </p>
        </div>

        {/* Search Box Section */}
        <div className="search-container">
          <Searchbox 
            placeholder="Search a protein"
            onSearch={this.handleSearch}
          />
        </div>

        {/* Search Results Section */}
        <div className="search-results-container">
          {this.state.searchResults.length > 0 ? (
            <SearchResults 
              results={this.state.searchResults}
              onSearch={this.handleSearch}
            />
          ) : (
            <p>No data available for the given query.</p>
          )}
        </div>

        {/* Plot Section */}
        <div className="plot-container">
          <PlotComponent plotData={this.state.plotData1} title="Cancer Type vs. Frequency" />
          <PlotComponent plotData={this.state.plotData2} title="Position vs. Frequency" chartType="LineChart" />
        </div>
      </div>
    );
  }
}

export default DatasetPage;
