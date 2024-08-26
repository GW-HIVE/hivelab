/*
BiomutaPlot Component
Purpose: To display visual data (e.g., cancer type vs. frequency, position vs. frequency plots).
Related Backend Script: getProteinData.py

This component should be capable of rendering Highcharts or other charts with data fetched from the backend.
The charts should be interactive, allowing users to toggle between different views (e.g., cancer type vs. frequency, position vs. frequency).
Integrate with the dataset view to provide detailed data visualizations.

*/
import React from 'react';
import Chart from 'react-google-charts';

const PlotComponent = ({ plotData, title }) => {
  const transformDataForChart = (plotData) => {
    if (!plotData || plotData.length === 0) {
      console.log("No plotData available.");
      return [];
    }
    const chartData = [["Label", "Frequency"]];
    plotData.forEach((dataPoint) => {
      console.log("Transforming dataPoint:", dataPoint);
      chartData.push([dataPoint.x, dataPoint.y1]);
    });
    return chartData;
  };

  const transformedPlotData = transformDataForChart(plotData);

  if (transformedPlotData.length <= 1) {
    console.log("No valid data after transformation:", transformedPlotData);
    return (
      <div style={styles.noDataMessage}>
        <p>No data available for the provided accession.</p>
      </div>
    );
  }

  console.log("Rendering chart with data:", transformedPlotData);

  const chartOptions = {
    chartArea: { width: '70%' },
    hAxis: {
      title: title === "Cancer Type vs. Frequency" ? 'Frequency of nsSNVs' : 'Frequency of nsSNVs',
      minValue: 0,
      textStyle: { fontSize: 12, color: '#333' },
      titleTextStyle: { fontSize: 14, bold: true, color: '#333' },
    },
    vAxis: {
      title: title === "Cancer Type vs. Frequency" ? 'Cancer Type (DOID and Name)' : 'Amino Acid Position',
      textStyle: { fontSize: 12, color: '#333' },
      titleTextStyle: { fontSize: 14, bold: true, color: '#333' },
    },
    legend: { position: 'none' },
    backgroundColor: '#f9f9f9',
    bar: { groupWidth: '75%' },
  };

  return (
    <div style={styles.plotContainer}>
      <h3 style={styles.plotTitle}>{title}</h3>
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={transformedPlotData}
        options={chartOptions}
      />
    </div>
  );
};

const styles = {
  plotContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  plotTitle: {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '5px',
    marginBottom: '20px',
  },
};

export default PlotComponent;
