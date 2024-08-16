/*
BiomutaSearchbox Component
Purpose: A search box component to allow users to search for gene names, accessions, or protein IDs.
Related Backend Script: searchBioMuta.py

The search box should trigger a search that interacts with the searchBioMuta API endpoint.
Upon submitting the search, the results should be fetched and displayed using the BiomutaSearchResults component.
*/

import React, { useState } from "react";
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const Searchbox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      onSearch(query);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();  // Trigger the search when Enter is pressed
    }
  };

  return (
    <div style={styles.searchBoxContainer}>
      <div style={styles.searchLabel}>
        Search by: Gene Name, Accession, or Protein ID
      </div>
      <Paper component="form" elevation={0} style={styles.searchBoxPaper}>
        <InputBase 
          id="query" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          style={styles.searchBoxInput}
          onKeyPress={handleKeyPress} // Handle Enter key press
        />
        <IconButton 
          onClick={handleSearch}  // Trigger the search on click
          style={styles.searchIcon}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
};

const styles = {
  searchBoxContainer: {
    width: "100%",
    marginBottom: "20px",
  },
  searchLabel: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#333",
  },
  searchBoxPaper: {
    display: "flex",
    alignItems: "center",
    padding: "5px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxShadow: "none",
  },
  searchBoxInput: {
    marginLeft: "8px",
    flex: 1,
    fontSize: "14px",
    color: "#333",
  },
  searchIcon: {
    padding: "10px",
    color: "#555",
  }
};

export default Searchbox;
