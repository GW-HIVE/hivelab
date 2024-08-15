import React from "react";
import Searchbox from "./biomuta_searchbox";
import Resultfilter from "./result_filter";
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
    isLoaded: false,
  };

  handleSearch = () => {
    const queryValue = $("#query").val() || "";
    const reqObj = { qryList: [{ fieldname: "geneName", fieldvalue: queryValue }] };

    this.handleFilterReset();

    const requestOptions = { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqObj)
    };
    const svcUrl = "/searchBioMuta";

    fetch(svcUrl, requestOptions)
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            response: result,
            isLoaded: true,
            dialog: result.taskStatus === 0 ? { status: true, msg: result.errorMsg } : this.state.dialog
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
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
    const { response, isLoaded, filterlist, pageIdx, pageStartIdx, pageEndIdx, dialog } = this.state;
    
    if (!isLoaded) {
      return <Loadingicon />;
    }

    const objList = (response && response.searchresults) ? response.searchresults.slice(2) : []; // Assuming the first two entries are headers
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
      <div>
        <Alertdialog dialog={dialog} onClose={() => this.setState({ dialog: { status: false } })} />

        <div className="pagecn">
          <div className="leftblock" style={{width:"100%", margin:"20px 0px 0px 0px"}}>
            <Searchbox onSearch={this.handleSearch} />
          </div>
          <div className="leftblock" style={{width:"100%", margin:"5px 0px 0px 0px", display: filterHideFlag}}>
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

          <div className="leftblock" style={{width:"100%", margin:"60px 0px 0px 0px", borderBottom:"1px solid #ccc"}}>
            <Paginator 
              paginatorId={"top"}
              pageCount={pageCount}
              pageStartIdx={pageStartIdx}
              pageEndIdx={pageEndIdx}
              onClick={this.handlePaginatorClick}
            />
          </div>

          <div className="leftblock" style={{margin:"20px 0px 0px 0px"}}>
            {rndrSearchResults(passedObjList, startIdx, endIdx)}
          </div>

          <div className="leftblock" style={{width:"100%", margin:"0px 0px 0px 0px", padding:"5px 0px 0px 0px", borderTop:"1px solid #ccc"}}>
            <Paginator 
              paginatorId={"bottom"}
              pageCount={pageCount}
              pageStartIdx={pageStartIdx}
              pageEndIdx={pageEndIdx}
              onClick={this.handlePaginatorClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResults;
