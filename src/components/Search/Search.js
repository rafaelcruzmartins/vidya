import React, { useState } from "react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const mockData = [
    "Apple",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
    "Imbe",
    "Jackfruit",
  ];
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
    } else {
      const filteredResults = mockData.filter((item) =>
        item.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filteredResults);
      setShowResults(true);
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />
      {showResults && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <div key={index} className="search-results-list">
              {result}
            </div>
          ))}
        </div>
      )}
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"
          fill="#0A2463"
        />
      </svg>
    </div>
  );
};

export default Search;
