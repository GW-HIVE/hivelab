import React from 'react';
import Chart from 'react-google-charts';

const PlotComponent = ({ plotData, title, yAxisTitle, xAxisTitle, description, legend }) => {
  const transformDataForChart = (plotData) => {
    if (!plotData || plotData.length === 0) {
      console.log("No plotData available.");
      return [];
    }

    // Extract legend titles either from the provided legend or from plotData's first row
    const legendTitles = legend || plotData[0].slice(1).map((_, index) => `Expression ${index + 1}`);

    const chartData = [
      ["Cancer Type", ...legendTitles]
    ];

    plotData.forEach((dataPoint) => {
      const label = dataPoint[0];  // The first element is the label (e.g., Cancer Type)
      const values = dataPoint.slice(1);  // The rest are the data points

      // Ensure that the values are all numbers and there's no discrepancy in the number of elements
      if (values.length === legendTitles.length) {
        chartData.push([label, ...values.map(value => parseFloat(value))]);
      } else {
        console.warn(`Skipping data point due to mismatch in lengths: ${dataPoint}`);
      }
    });

    return chartData;
  };

  const transformedPlotData = transformDataForChart(plotData);

  console.log("Received plotData:", plotData);
  console.log("Transformed plotData:", transformedPlotData);

  if (transformedPlotData.length <= 1) {
    console.log("No valid data after transformation:", transformedPlotData);
    return (
      <div style={styles.noDataMessage}>
        <p>No data available for the provided accession.</p>
      </div>
    );
  }

  const chartOptions = {
    chartArea: { width: '70%' },
    hAxis: {
      title: xAxisTitle || title,  // Use xAxisTitle or fallback to title
      textStyle: { fontSize: 12, color: '#333' },
      titleTextStyle: { fontSize: 14, bold: true, color: '#333' },
    },
    vAxis: {
      title: yAxisTitle || 'Expression Levels',
      minValue: 0,
      textStyle: { fontSize: 12, color: '#333' },
      titleTextStyle: { fontSize: 14, bold: true, color: '#333' },
    },
    legend: { position: 'top', alignment: 'start', maxLines: 3, textStyle: { fontSize: 12 }},
    backgroundColor: '#f9f9f9',
    bar: { groupWidth: '75%' },
    colors: ['#4CAF50', '#FF7043', '#42A5F5', '#66BB6A', '#FFA726'],
  };

  return (
    <div style={styles.plotContainer}>
      <h3 style={styles.plotTitle}>{title}</h3>
      <Chart
        chartType="ColumnChart"
        width="100%"
        height="400px"
        data={transformedPlotData}
        options={chartOptions}
      />
      {description && <p style={styles.plotDescription}>{description}</p>}
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
    width: '100%',
  },
  plotTitle: {
    marginBottom: '15px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
  },
  plotDescription: {
    marginTop: '10px',
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
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
