import React, { Component } from "react";
import PlotComponent from "./biomuta_plot";
import Loadingicon from "./global/loading_icon";
import Paginator from "./paginator";

class DatasetPage extends Component {
  state = {
    mutationTable: [],
    plotData1: [],
    plotData2: [],
    error: null,
    canonicalAc: "", 
    isLoading: true, 
    currentPage: 1,
    rowsPerPage: 10,
    downloadFilename: "",  // Add this to store the filename for the CSV download
  };

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const geneParam = urlParams.get('gene');
    
    let canonicalAc = "";
  
    if (geneParam) {
      canonicalAc = geneParam;
    } else {
      canonicalAc = window.location.pathname.split("/").pop();
    }
  
    this.setState({ canonicalAc }, () => {
      console.log("Canonical AC set:", this.state.canonicalAc);
      this.fetchProteinData();
    });
  }
  
  fetchProteinData = () => {
    const { canonicalAc } = this.state;
    console.log("Starting to fetch protein data for:", canonicalAc);
    
    const startFetch = performance.now(); // Start timing the fetch
    
    let request;
    if (window.location.search.includes("gene=")) {
      // If a gene query parameter is present, use GET
      request = fetch(`biomuta/api/getProteinData?gene=${canonicalAc}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Otherwise, use POST for canonicalAc
      request = fetch("biomuta/api/getProteinData", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldvalue: canonicalAc })
      });
    }
  
    request
      .then((res) => {
        const fetchDuration = performance.now() - startFetch;
        console.log("Fetch completed in:", fetchDuration, "ms");
        return res.json();
      })
      .then(
        (result) => {
          console.log("Result received:", result); // Log the entire result object
    
          if (result.taskStatus === 1) {
            this.setState({
              mutationTable: Array.isArray(result.mutationtable) ? result.mutationtable : [],
              plotData1: Array.isArray(result.plotdata1) ? result.plotdata1 : [],
              plotData2: Array.isArray(result.plotdata2) ? result.plotdata2 : [],
              downloadFilename: result.downloadfilename || "",  // Store the download filename
              error: null,
              isLoading: false,
            });
          } else {
            this.setState({
              error: result.errorMsg,
              isLoading: false
            });
          }
        },
        (error) => {
          console.error("Error fetching protein data:", error);
          this.setState({
            error: error.message,
            isLoading: false
          });
        }
      );
  };

  handlePageChange = (pageNumber) => {
    console.log("Page changed to:", pageNumber);
    this.setState({ currentPage: pageNumber });
  };

  renderMutationTable = () => {
    console.log("Rendering mutation table.");
    const { mutationTable, currentPage, rowsPerPage } = this.state;

    if (!Array.isArray(mutationTable) || mutationTable.length === 0) {
      return <p>No mutation data available for the given protein.</p>;
    }

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = mutationTable.slice(indexOfFirstRow, indexOfLastRow);

    return (
      <>
        <table className="mutation-table">
          <thead>
            <tr>
              <th>Chr</th>
              <th>Chr Position</th>
              <th>Protein Position</th>
              <th>Ref Codon</th>
              <th>Alt Codon</th>
              <th>Ref Residue</th>
              <th>Alt Residue</th>
              <th>Cancer Type</th>
              <th>Uberon Id</th>
              <th>Frequency</th>
              <th>Data Source</th>
              <th>UniProt Annotation</th>
              <th>Functional Predictions</th>
              <th>PMID</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, idx) => (
                  <td key={idx}>
                    {Array.isArray(cell) ? cell.map(item => String(item)).join(', ') : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-download-container">
          <Paginator
            rowsPerPage={rowsPerPage}
            totalRows={mutationTable.length}
            paginate={this.handlePageChange}
            currentPage={currentPage}
          />
          {/* Render the download button next to the paginator */}
          {this.state.downloadFilename && (
            <div className="download-button">
              <a href={`/biomuta/api/download/${this.state.downloadFilename}`} download>
                Download CSV
              </a>
            </div>
          )}
        </div>
      </>
    );
  };

  renderChartInfo = () => {
    console.log("Rendering chart info.");
    return (
      <div className="chart-info">
        <h3>Understanding the Charts</h3>
        <p>
          The charts below provide a visual representation of the mutation data associated with this protein.
        </p>
        <ul>
          <li>
            <strong>Cancer Type vs. nsSNV Frequency Plot:</strong> The cancer type vs. nsSNV frequency plot displays the frequency of reported nsSNVs (y-axis) in the gene/protein of interest associated with specific cancer types, as indicated by DOIDs and names on the x-axis. A higher bar indicates a higher occurrence of mutations in that particular cancer type.
          </li>
          <li>
            <strong>Amino Acid Position vs. SNV Frequency Plot:</strong> The SNV frequency vs. amino acid position plot shows the frequency of nsSNVs (y-axis) reported for each position in the amino acid sequence corresponding to the specified gene/protein (x-axis).
          </li>
        </ul>
      </div>
    );
  };

  render() {
    console.log("Rendering DatasetPage.");
    const { canonicalAc, error, plotData1, plotData2, isLoading, downloadFilename } = this.state;

    return (
      <div className="dataset-page">
        <div className="info-section">
          <h2>Protein Data for {canonicalAc}</h2>
          <p>
            Below is the detailed mutation data and visualizations for the protein with accession {canonicalAc}.
          </p>
        </div>

        {isLoading ? (
          <Loadingicon />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Plots positioned horizontally */}
            <div className="plot-container">
              <div className="horizontal-plots">
                {Array.isArray(plotData1) && plotData1.length > 0 && (
                  <PlotComponent plotData={plotData1} title="Cancer Type vs. Frequency" />
                )}
                {Array.isArray(plotData2) && plotData2.length > 0 && (
                  <PlotComponent plotData={plotData2} title="Position vs. Frequency" />
                )}
              </div>
            </div>

            {this.renderChartInfo()}

            <div className="mutation-table-container">
              {this.renderMutationTable()}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default DatasetPage;
