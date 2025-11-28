import React from 'react'

function Search({ searchTerm, setSearchTerm }) {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />
                <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
                type="text" 
                placeholder='Search for movies, TV shows, genres, etc.' />
            </div>

        </div>
    )
}
export default Search