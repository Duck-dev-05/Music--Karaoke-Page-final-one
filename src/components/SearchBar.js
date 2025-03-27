import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        setQuery(e.target.value);
        if (e.target.value) {
            try {
                const response = await axios.get(`YOUR_API_ENDPOINT?search=${e.target.value}`);
                setResults(response.data); // Update state with API response
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        } else {
            setResults([]); // Clear results if input is empty
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Search songs..."
            />
            <div>
                {results.length > 0 ? (
                    results.map((song) => <div key={song.id}>{song.title}</div>)
                ) : (
                    <p>No songs found</p>
                )}
            </div>
        </div>
    );
};

export default SearchBar; 