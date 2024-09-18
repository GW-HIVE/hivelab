import React, { Component } from "react";
import BioxpressPlotComponent from "./bioxpress_plot";
import Loadingicon from "./global/loading_icon";
import Paginator from "./paginator";
import BioMutaTable from "./BiomutaTable";

class TranscriptDatasetPage extends Component {
  state = {
    mutationTable: [],
    expressionTable: [],
    bgeeTable: [],
    textmineTable: [],
    plotData1: [],
    plotData2: [],
    plotData3: [],
    error: null,
    canonicalAc: "",
    isLoading: true,
    currentPage: 1,
    rowsPerPage: 10,
    downloadFiles: [],
  };

  componentDidMount() {
    const canonicalAc = decodeURIComponent(window.location.pathname.split("/").pop());
    this.setState({ canonicalAc }, () => {
      this.fetchProteinData();
    });
  }

  fetchProteinData = () => {
    const { canonicalAc } = this.state;

    fetch("/bioxpress/api/getTranscriptData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldvalue: canonicalAc }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.taskStatus === 1) {
            this.setState({
              mutationTable: Array.isArray(result.mutationtable) ? result.mutationtable : [],
              expressionTable: Array.isArray(result.expressiontable) ? result.expressiontable : [],
              bgeeTable: Array.isArray(result.bgeetable) ? result.bgeetable : [],
              textmineTable: Array.isArray(result.textminetable) ? result.textminetable : [],
              plotData1: Array.isArray(result.plotdata1) ? result.plotdata1 : [],
              plotData2: Array.isArray(result.plotdata2) ? result.plotdata2 : [],
              plotData3: Array.isArray(result.plotdata3) ? result.plotdata3 : [],
              downloadFiles: result.downloadfiles || [],
              error: null,
              isLoading: false,
            });
          } else {
            this.setState({ error: result.errorMsg, isLoading: false });
          }
        },
        (error) => {
          this.setState({ error: JSON.stringify(error), isLoading: false });
        }
      );
  };

  renderBioMutaTable = (tableData) => {
    if (!Array.isArray(tableData) || tableData.length === 0) {
      return <p>No data available.</p>;
    }

    const headers = tableData[0];
    const data = tableData.slice(2);

    return <BioMutaTable headers={headers} data={data} />;
  };

  render() {
    const { canonicalAc, error, plotData1, plotData2, plotData3, expressionTable, bgeeTable, textmineTable, downloadFiles, isLoading } = this.state;

    const plotDescriptions = {
      plotdesc_1: "This chart displays the frequencies of patients following each expression trend for QVALUE in all relevant cancer types: over-expression is denoted by the green series, and under-expression is denoted by the orange bars. For each patient, log2 fold change (log2FC) values greater than zero are considered to follow an over-expression trend, less than zero to follow under-expression trend. Patients with log2FC = 0 were excluded in the figure. Note that all patients are included in this graphic despite statistical significance of the trend.",
      plotdesc_2: "This chart shows the proportion of patients whose individual expression trend (over- or under-expression) matches the significant trend reported for QVALUE across different cancer types, with each colored series denoting a different threshold. The '+' and '-' indicate the significant trend for the associated cancer, representing over- and under-expression, respectively. Green bars: each bar represents the frequency of patients whose individual QVALUE expression trend matches the significant trend where differential expression is defined as |log2FC| > 0. Blue bars: each bar represents the frequency of patients whose individual QVALUE expression has log2FC greater than the pooled cancer-wise log2FC if QVALUE if the gene is reported to be over-expressed, or less than the pooled cancer-wise log2FC if it is under-expressed.",
      plotdesc_3: "This chart displays the comprehensive tumor expression of QVALUE, including expression from those samples with matched normal data and all unpaired tumor samples from TCGA. Expression levels for mRNA are log2(raw read counts), while for miRNA, they are log2(RPKM)."
    };

    return (
      <div className="dataset-page">
        <div className="info-section">
          <h2>Transcript Data for {canonicalAc}</h2>
          <p>Below is the detailed expression results and visualizations for the transcript with accession {canonicalAc}.</p>
        </div>

        {isLoading ? (
          <Loadingicon />
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="plot-section">
                {Array.isArray(plotData1) && plotData1.length > 0 && (
                  <>
                    <BioxpressPlotComponent
                      plotData={plotData1.slice(1)}  // Slicing  to remove the first row
                      title="Expression Trend Frequency Plot"
                      yAxisTitle="Counts and frequencies of expression trends"
                      xAxisTitle="Cancer Type"
                      colors={['#4CAF50', '#FF7043']}
                      description={plotDescriptions.plotdesc_1}
                      legend={['Over-expression', 'Under-expression']} // Pass the legend titles
                    />
                  </>
                )}
              </div>
              <div className="plot-section">
                {Array.isArray(plotData2) && plotData2.length > 0 && (
                  <>
                    <BioxpressPlotComponent
                      plotData={plotData2.slice(1)}  // Sliceto remove the first row
                      title="Expression Trend Significance Plot"
                      yAxisTitle="Frequency (%) of expression trends"
                      xAxisTitle="Cancer Type"
                      colors={['#42A5F5', '#FFA726']}
                      description={plotDescriptions.plotdesc_2}
                      legend={['Patients matching significant trend with threshold of patient |log2FC| > 0', 'Patients matching significant trend with threshold of patient |log2FC| > cancer |log2FC|']} // Pass the legend titles
                    />
                  </>
                )}
              </div>
              <div className="plot-section">
                {Array.isArray(plotData3) && plotData3.length > 0 && (
                  <>
                    <BioxpressPlotComponent
                      plotData={plotData3}
                      title="Tumor-Only Expression Plot"
                      yAxisTitle="Log2(expression)"
                      xAxisTitle="Cancer Type"
                      colors={['#66BB6A', '#FF7043']}
                      description={plotDescriptions.plotdesc_3}
                    />
                  </>
                )}
              </div>

            <div className="expression-table-container">
              <h3>Expression Table</h3>
              {this.renderBioMutaTable(expressionTable)}
            </div>
            <div className="bgee-table-container">
              <h3>Bgee Table</h3>
              {this.renderBioMutaTable(bgeeTable)}
            </div>
            <div className="textmine-table-container">
              <h3>Textmine Table</h3>
              {this.renderBioMutaTable(textmineTable)}
            </div>

            <div className="download-buttons">
              {downloadFiles.map((file, index) => (
                <div key={index} className="download-button">
                  <a href={`/bioxpress/api/download/${file}`} download>
                    Download {file.split("-")[0].toUpperCase()} CSV
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default TranscriptDatasetPage;
