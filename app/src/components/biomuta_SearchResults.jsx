/*
Purpose: Displays the search results returned by the backend.
Related Backend Script: searchBioMuta.py

This component should fetch results from the searchBioMuta API endpoint and display them in a table format.
Integrate filtering and pagination options similar to those described in module.js.
Handle edge cases, such as no results found or errors in fetching data.
*/

import React from "react";
import Resultfilter from "./result_filter";
import Searchbox from "./biomuta_searchbox";
import { filterObjectList, rndrSearchResults } from './util';
import Paginator from "./paginator";
import Loadingicon from "./global/loading_icon";
import Alertdialog from './global/dialogbox';
import $ from "jquery";

class SearchResults extends React.Component {  
  state = {
    filterlist: [],
    pageIdx: 1,
    pageBatchSize: 5,
    pageStartIdx: 1,
    pageEndIdx: 5,
    dialog: {
      status: false, 
      msg: ""
    },
    response: null,
    isLoaded: true,
    isSearching: false,
  };

  handleSearch = (queryValue) => {
    if (!queryValue) {
      this.setState({
        dialog: {
          status: true,
          msg: "Please enter a valid search term."
        }
      });
      return;
    }

    this.setState({
      isLoaded: false,
      isSearching: true,
    });

    const reqObj = { qryList: [{ fieldname: "geneName", fieldvalue: queryValue }] };

    this.handleFilterReset();

    const requestOptions = { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqObj)
    };
    const svcUrl = "/api/searchBioMuta";

    fetch(svcUrl, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            response: result,
            isLoaded: true,
            isSearching: false,
            dialog: result.taskStatus === 0 ? { status: true, msg: result.errorMsg } : this.state.dialog
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            isSearching: false,
            dialog: {
              status: true,
              msg: "An error occurred while fetching the data. Please try again."
            }
          });
        }
      );
  };

  handleFilterReset = () => {
    $('input[name="filtervalue"]:checkbox:checked').prop("checked", false);
    this.setState({ filterlist: [] });
  };

  handleFilterApply = () => {
    $("#filtercn").toggle();
    const tmpList = $('input[name="filtervalue"]:checkbox:checked')
      .map(function () {
        return $(this).val();
      })
      .get(); 
    this.setState({ filterlist: tmpList });
  };

  handlePaginatorClick = (e) => {
    if (e.target.id.includes("_disabled")) return;

    let pageIdx = parseInt(e.target.id.split("_")[2]);
    let tmpState = { ...this.state };

    if (e.target.id.includes("_next_")) {
      tmpState.pageStartIdx = tmpState.pageEndIdx + 1;
      tmpState.pageEndIdx += tmpState.pageBatchSize;
      pageIdx = tmpState.pageStartIdx;
    } else if (e.target.id.includes("_prev_")) {
      tmpState.pageStartIdx -= tmpState.pageBatchSize;
      tmpState.pageEndIdx = tmpState.pageStartIdx + tmpState.pageBatchSize - 1;
      pageIdx = tmpState.pageStartIdx;
    }
    tmpState.pageIdx = pageIdx;
    this.setState(tmpState);
  };

  render() {
    const { response, isLoaded, isSearching, filterlist, pageIdx, pageStartIdx, pageEndIdx, dialog } = this.state;
    
    if (isSearching) {
      return <Loadingicon />;
    }

    if (!isLoaded || !response) {
      return null; // Render nothing if no search has been made yet
    }

    const objList = (response && response.searchresults) ? response.searchresults.slice(2) : []; 
    const { filterinfo, passedobjlist: passedObjList } = filterObjectList(objList, filterlist);
    const passedCount = passedObjList.length;

    const batchSize = 20;
    const pageCount = Math.ceil(passedCount / batchSize);
    const startIdx = batchSize * (pageIdx - 1) + 1;
    const endIdx = Math.min(startIdx + batchSize - 1, passedCount);

    const filterHideFlag = objList.length > 0 ? "block" : "none";
    const tmpList = filterlist.map(f => `<b>${f.split("|")[1]}</b>`);
    const resultSummary = `<b>${passedCount}</b> results found${tmpList.length > 0 ? `, after filters: '${tmpList.join("', '")}'.` : "."}`;

    return (
      <div className="search-results-container">
        <Alertdialog dialog={dialog} onClose={() => this.setState({ dialog: { status: false } })} />

        <div className="filter-container" style={{ display: filterHideFlag }}>
          <Resultfilter
            filterinfo={filterinfo}
            resultcount={objList.length}
            resultSummary={resultSummary}
            handleSearchIcon={this.handleSearchIcon}
            handleFilterIcon={this.handleFilterIcon}
            handleFilterApply={this.handleFilterApply}
            handleFilterReset={this.handleFilterReset}
          />
        </div>

        <div className="paginator-container top">
          <Paginator 
            paginatorId={"top"}
            pageCount={pageCount}
            pageStartIdx={pageStartIdx}
            pageEndIdx={pageEndIdx}
            onClick={this.handlePaginatorClick}
          />
        </div>

        <div className="results-table">
          {passedCount > 0 ? rndrSearchResults(passedObjList, startIdx, endIdx) : <p>No results found</p>}
        </div>

        <div className="paginator-container bottom">
          <Paginator 
            paginatorId={"bottom"}
            pageCount={pageCount}
            pageStartIdx={pageStartIdx}
            pageEndIdx={pageEndIdx}
            onClick={this.handlePaginatorClick}
          />
        </div>
      </div>
    );
  }
}

export default SearchResults;
