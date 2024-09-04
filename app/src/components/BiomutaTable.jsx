import React from 'react';

const BioMutaTable = ({ headers, data }) => {
  if (!data || data.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="biomuta-table-container" style={styles.tableContainer}>
      <table className="biomuta-table" style={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={styles.header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={rowIndex % 2 === 0 ? styles.evenRow : styles.oddRow}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={styles.cell}>
                  {typeof cell === 'string' && cell.startsWith('<a') ? (
                    <span dangerouslySetInnerHTML={{ __html: cell }} />
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableContainer: {
    width: '100%',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#00395D',
    color: 'white',
    textAlign: 'left',
    padding: '12px 8px',
    border: '1px solid #ddd',
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
  cell: {
    textAlign: 'left',
    padding: '10px 8px',
    border: '1px solid #ddd',
    color: '#333',
  },
};

export default BioMutaTable;
