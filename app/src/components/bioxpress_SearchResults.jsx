import React, { Component } from "react";
import Loadingicon from "./global/loading_icon";
import BioMutaTable from "./BiomutaTable";
import Paginator from "./paginator";

class SearchResults extends Component {
  state = {
    isLoaded: true,
    isSearching: false,
    response: null,
    currentPage: 1,  // Current page for pagination
    rowsPerPage: 10,  // Number of rows per page
  };

  componentDidMount() {
    console.log("ComponentDidMount - Query:", this.props.query);
    this.searchData(this.props.query);
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      console.log("ComponentDidUpdate - New Query:", this.props.query);
      this.searchData(this.props.query);
    }
  }

  searchData(queryValue) {
    if (!queryValue) {
      console.log("searchData - No query provided, skipping search.");
      return;
    }

    console.log("searchData - Starting search with query:", queryValue);

    this.setState({
      isLoaded: false,
      isSearching: true,
    });

    const reqObj = { 
        qrylist: [
          { fieldname: "searchtype", fieldvalue: "transcriptsearch" },
          { fieldname: "searchvalue1", fieldvalue: queryValue }
        ]
    };

    console.log("searchData - Request object:", reqObj);

    fetch("https://hivelab.prd.biochemistry.gwu.edu/bioxpress/api/transcriptSearch", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqObj)
    })
    .then(response => {
      console.log("searchData - Raw response:", response);
      return response.json();
    })
    .then(searchBioxpressResult => {
      console.log("searchData - Parsed response:", searchBioxpressResult);
      if (searchBioxpressResult.taskStatus === 1 && searchBioxpressResult.searchresults.length > 2) { // Ensuring there's data beyond headers and types
        this.setState({
          response: searchBioxpressResult,
          isLoaded: true,
          isSearching: false,
          currentPage: 1,  // Reset to the first page when new data is loaded
        });
        console.log("searchData - State updated with response data.");
      } else {
        this.setState({
          isLoaded: true,
          isSearching: false,
          response: null, // No results found
        });
        console.log("searchData - No valid data found, setting response to null.");
      }
    })
    .catch(error => {
      console.error("searchData - Error fetching data from backend:", error);
      this.setState({
        isLoaded: true,
        isSearching: false,
        response: null, // Handle fetch error by resetting response
      });
    });
  }

  handleLinkClick = (cell) => {
    // Extract the canonical AC from the cell
    const match = cell.match(/>([^<]+)<\/a>/);
    if (match) {
        const featureId = match[1]; // Extract the Feature ID
        // Redirect to the desired URL
        window.location.href = `/bioxpress/transcriptView/${featureId}`;
    }
  }

  cleanData(data) {
    return data.map((row) => {
      if (!Array.isArray(row)) {
        console.error('Unexpected non-array row:', row);
        return []; // Return an empty array to prevent breaking map in BioMutaTable
      }
      return row.map((cell) => {
        if (cell === null || cell === undefined || cell === 'NaN' || Number.isNaN(cell)) {
          return 'N/A';
        }
        return cell;
      });
    });
  }

  handlePageChange = (pageNumber) => {
    console.log("handlePageChange - Changing page to:", pageNumber);
    this.setState({ currentPage: pageNumber });
  };

  render() {
    console.log("Render - State:", this.state);

    const { response, isLoaded, isSearching, currentPage, rowsPerPage } = this.state;

    if (isSearching) {
      console.log("Render - Currently searching, showing loading icon.");
      return <Loadingicon />;
    }

    if (!isLoaded) {
      console.log("Render - Not loaded yet, returning null.");
      return null;
    }

    if (!response) {
      console.log("Render - No response found, showing no results message.");
      return (
        <div className="no-results-message">
          <p>No results found for the given query.</p>
        </div>
      );
    }

    const headers = response.searchresults[0];
    const data = response.searchresults.slice(2); // Skip the header and type rows
    const cleanedData = this.cleanData(data);

    console.log("Render - Headers:", headers);
    console.log("Render - Cleaned Data:", cleanedData);

    // Get current rows
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = cleanedData.slice(indexOfFirstRow, indexOfLastRow);

    


    const renderedData = currentRows.map((row, rowIndex) => {
        const renderedRow = row.map((cell, cellIndex) => {
          if (cellIndex === 0) {
            const match = cell.match(/href="([^"]+)"/);
            const url = match ? match[1] : "#";
            return (
              <span 
                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                onClick={() => this.handleLinkClick(cell)}
                key={cellIndex}
              >
                {cell.replace(/<a[^>]+>([^<]+)<\/a>/, "$1")}
              </span>
            );
          }
          return cell;
        });
        return renderedRow; // Return the rendered row which is an array of cells
      });

    console.log("Render - Rendered Data:", renderedData);

    return (
      <div className="search-results-container">
        <BioMutaTable headers={headers} data={renderedData} />
        <Paginator
          rowsPerPage={rowsPerPage}
          totalRows={cleanedData.length}
          paginate={this.handlePageChange}
          currentPage={currentPage}
        />
        <div className="download-button">
          {response.downloadfiles && response.downloadfiles.length > 0 && (
            <a href={`/bioxpress/api/download/${response.downloadfiles[0]}`} download>
              Download CSV
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default SearchResults;
