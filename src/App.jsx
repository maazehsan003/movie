import { useEffect, useState } from 'react'
import './App.css'
import Search from './components/search.jsx'
import Spinner from './components/spinner.jsx'
import MovieCard from './components/movieCard.jsx'
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const [errormessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = '') => {

    setErrorMessage('');
    
    setIsLoading(true);
    try {
    
      const endpoint = query ? 
    
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
    
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;
      
      const response = await fetch(endpoint, API_OPTIONS);
      
      const data = await response.json();
      
      if (data.response === 'false') {
        setErrorMessage('No movies found. Please try a different search term.');
        setMovieList([ ]);
        return;
      }
      
      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    }

    catch (error) {
    
      setErrorMessage('An error occurred while fetching data. Please try again later.');
    
    }
    
    
    finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
        const movies = await getTrendingMovies();

        setTrendingMovies(movies);
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(()=> {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main>
    <div className="pattern">
      <div className='wrapper'>
        <header>
        <img src="./hero.png" alt="" className='' />
        <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without The Hassle</h1>
       <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length>0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>

                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />

                </li>
              ))}
            </ul>

          </section>
        )}

        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ?  <Spinner />  :
            errormessage ? (
              <p className="text-red-500">{errormessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
              
            

        </section>
        
        

      </div>
    </div>
    </main>

    
  )
}

export default App
