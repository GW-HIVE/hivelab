
import Searchbox from "./biomuta_searchbox";
import SearchResults from "./biomuta_SearchResults";
import React, { useState } from "react";



const BiomutaParentPage = () => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1>BioMuta Protein Dataset Search</h1>
      </div>

      <div style={styles.infoSection}>
        <p>BioMuta can be used to query the cancer nsSNV database using a gene- or protein-centric search.Use this tool to search for detailed protein datasets by Gene Name, Accession Number, or Protein ID. Enter your query in the search box below to retrieve relevant data. </p>
        
        <p>All possible hits to the submitted query will be listed in an interactive interim results table. Click on the hyperlinked UniProtKB AC to view detailed results for a given entity.</p>

        <h5 style={styles.subHeader}>Example Queries: KRAS, BRCA1, Q9P1W8-1</h5>
        
      </div>

      <Searchbox onSearch={handleSearch} />

      {searchQuery && <SearchResults query={searchQuery} />}
    </div>
  );
};

const styles = {
  pageContainer: {
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },
  header: {
    marginBottom: "20px",
  },
  infoSection: {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  subHeader: {
    marginTop: "15px",
    fontWeight: "bold",
  },
};

export default BiomutaParentPage;
