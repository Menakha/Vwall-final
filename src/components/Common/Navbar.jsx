import React, { useState } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import "../../css/theme.css";

export default function Navbar({ onSearch }) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setQuery("");
      onSearch("");
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <>
      <header className={`navbar-top ${showSearch ? "expanded" : ""}`}>
        {/* Logo centered */}
        <div className="logo-fixed">
          V<span className="logo-accent">Wall</span>
        </div>

        {/* Fixed Search Button */}
        <button className="search-icon-fixed" onClick={toggleSearch}>
          {showSearch ? <XIcon size={22} /> : <SearchIcon size={22} />}
        </button>

        {/* Expandable Search Bar */}
        {showSearch && (
          <div className="search-bar">
            <input
              className="search-input"
              placeholder="Search posts..."
              value={query}
              onChange={handleChange}
              autoFocus
            />
          </div>
        )}
      </header>
    </>
  );
}
