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

    /*const reqObj = { qryList: [{ fieldname: "searchtype", fieldvalue: "transcriptsearch" }, { fieldname: "searchvalue1", fieldvalue: queryValue }] };*/

    fetch("https://hivelab.tst.biochemistry.gwu.edu/bioxpress/api/transcriptSearch", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: { qryList: [{ fieldname: "searchtype", fieldvalue: "transcriptsearch" }, { fieldname: "searchvalue1", fieldvalue: queryValue }] }
    })
    .then(response => response.json())
    .then(searchBioxpressResult => {
      if (searchBioxpressResult.taskStatus === 1 && searchBioxpressResult.searchresults.length > 2) { // Ensuring there's data beyond headers and types
        this.setState({
          response: searchBioxpressResult,
          isLoaded: true,
          isSearching: false,
          currentPage: 1,  // Reset to the first page when new data is loaded
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

  handleLinkClick = (url) => {
    window.open(url, "_blank");
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

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { response, isLoaded, isSearching, currentPage, rowsPerPage } = this.state;

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

    // Get current rows
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = cleanedData.slice(indexOfFirstRow, indexOfLastRow);

    const renderedData = currentRows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, cellIndex) => {
          if (cellIndex === 0) {
            const match = cell.match(/href"([^"]+)"/);
            const url = match ? match[1] : "#";
            return (
              <td key={cellIndex}>
                <span 
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                  onClick={() => this.handleLinkClick(url)}
                >
                  {cell.replace(/<a[^>]+>([^<]+)<\/a>/, "$1")}
                </span>
              </td>
            );
          }
          return <td key={cellIndex}>{cell}</td>;
        })}
      </tr>
    ));

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
            <a href={`http://127.0.0.1:5000/download/${response.downloadfiles[0]}`} download>
              Download CSV
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default SearchResults;
