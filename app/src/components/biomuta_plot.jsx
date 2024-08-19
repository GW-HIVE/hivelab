/*
BiomutaPlot Component
Purpose: To display visual data (e.g., cancer type vs. frequency, position vs. frequency plots).
Related Backend Script: getProteinData.py

This component should be capable of rendering Highcharts or other charts with data fetched from the backend.
The charts should be interactive, allowing users to toggle between different views (e.g., cancer type vs. frequency, position vs. frequency).
Integrate with the dataset view to provide detailed data visualizations.

*/
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const PlotComponent = ({ accession }) => {
  const [plotData1, setPlotData1] = useState(null);
  const [plotData2, setPlotData2] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!accession) return;  // Don't fetch data if no accession is provided

    setIsLoading(true);
    fetch("/api/getProteinData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldname: "uniprot_ac", fieldvalue: accession }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setPlotData1(data.plotdata1 || []);
        setPlotData2(data.plotdata2 || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setError('Failed to load plot data.');
        setIsLoading(false);
      });
  }, [accession]);

  if (!accession) {
    return (
      <div className="info-message-container">
        <div className="info-message">
          <i className="info-icon"></i> {/* Add an icon here */}
          <p>Please enter a search query to display data.</p>
          <p>Try searching by Gene Name, Accession Number, or Protein ID.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading data, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!plotData1 && !plotData2) {
    return (
      <div className="no-data-message">
        <p>No data available for the provided accession.</p>
      </div>
    );
  }

  return (
    <div className="plot-container">
      <h3>Cancer Type vs. Frequency</h3>
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={plotData1}
        options={{
          chartArea: { width: '50%' },
          hAxis: { title: 'Frequency', minValue: 0 },
          vAxis: { title: 'Cancer Type' },
          legend: { position: 'none' }
        }}
      />
      <h3>Position vs. Frequency</h3>
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={plotData2}
        options={{
          chartArea: { width: '50%' },
          hAxis: { title: 'Frequency', minValue: 0 },
          vAxis: { title: 'Position' },
          legend: { position: 'none' }
        }}
      />
    </div>
  );
};

export default PlotComponent;

