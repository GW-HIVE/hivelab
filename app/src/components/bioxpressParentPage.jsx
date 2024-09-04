
import Searchbox from "./bioxpress_searchbox";
import SearchResults from "./bioxpress_SearchResults"
import React, { useState } from "react";



const BioxpressParentPage = () => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1>BioXpress Gene Search</h1>
      </div>

      <div style={styles.infoSection}>
        <p>BioXpress, a database of cancer-associated differentially expressed genes and microRNAs, is an aggregation of data across many studies into a single source with a unified representation and annotation of functional attributes. </p>
        
        <p>All possible hits to the submitted query will be listed in an interactive interim results table. Click on the hyperlinked Primary Feature ID to view detailed results for a given entity.</p>

        <h5 style={styles.subHeader}>Example Queries: P14210, Kras, Q9P1W8</h5>
        
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

export default BioxpressParentPage;
