/*
Purpose: Displays the search results returned by the backend.
Related Backend Script: searchBioMuta.py
Unified Initial Search: The initial search is always made to searchBioMuta.py. The results are checked to see if a canonicalAc (protein ID) is present.
Conditional Detailed Search: If a canonicalAc is found in the results, a secondary request is made to getProteinData.py to fetch detailed data about the protein.

This component should fetch results from the searchBioMuta API endpoint and display them in a table format.

*/
import React, { Component } from "react";
import Loadingicon from "./global/loading_icon";
import BioMutaTable from "./BiomutaTable";

class SearchResults extends Component {
  state = {
    isLoaded: true,
    isSearching: false,
    response: null,
  };

  componentDidMount() {
    this.searchData(this.props.query);
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.searchData(this.props.query);
    }
  }

  searchData(queryValue) {
    if (!queryValue) return;

    this.setState({
      isLoaded: false,
      isSearching: true,
    });

    const reqObj = { qryList: [{ fieldname: "geneName", fieldvalue: queryValue }] };

    fetch("/biomuta/api/searchBioMuta", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqObj)
    })
    .then(response => response.json())
    .then(searchBioMutaResult => {
      if (searchBioMutaResult.taskStatus === 1 && searchBioMutaResult.searchresults.length > 2) { // Ensuring there's data beyond headers and types
        this.setState({
          response: searchBioMutaResult,
          isLoaded: true,
          isSearching: false,
        });
      } else {
        this.setState({
          isLoaded: true,
          isSearching: false,
          response: null, // No results found
        });
      }
    })
    .catch(error => {
      console.error("Error fetching data from backend:", error);
      this.setState({
        isLoaded: true,
        isSearching: false,
        response: null, // Handle fetch error by resetting response
      });
    });
  }

  handleProteinClick = (canonicalAc) => {
    window.location.href = `/biomuta/proteinview/${canonicalAc}`;
  }

  cleanData(data) {
    return data.map((row) => {
      return row.map((cell) => {
        if (cell === null || cell === undefined || cell === 'NaN' || Number.isNaN(cell)) {
          return 'N/A';
        }
        return cell;
      });
    });
  }

  render() {
    const { response, isLoaded, isSearching } = this.state;

    if (isSearching) {
      return <Loadingicon />;
    }

    if (!isLoaded) {
      return null;
    }

    if (!response) {
      return (
        <div className="no-results-message">
          <p>No results found for the given query.</p>
        </div>
      );
    }

    const headers = response.searchresults[0];
    const data = response.searchresults.slice(2); // Skip the header and type rows
    const cleanedData = this.cleanData(data);

    const renderedData = cleanedData.map((row, rowIndex) => {
      return row.map((cell, cellIndex) => {
        if (cellIndex === 0) {
          return (
            <span 
              style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
              onClick={() => this.handleProteinClick(cell)}
              key={cellIndex}
            >
              {cell}
            </span>
          );
        }
        return <span key={cellIndex}>{cell}</span>;
      });
    });

    return (
      <div className="search-results-container">
        <BioMutaTable headers={headers} data={renderedData} />
      </div>
    );
  }
}

export default SearchResults;
