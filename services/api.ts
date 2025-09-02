export const TMDB_CONFIG = {
BASE: "https://api.themoviedb.org/3",
API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
HEADERS: {
    accept : 'application/json',
    Authorization : `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
}
}

export const fetchMovies = async ({query}: {query:string}) => {
    try {
        const endpoint =query?`/search/movie?query=${encodeURIComponent(query)}` :`/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(`${TMDB_CONFIG.BASE}${endpoint}`, {
            method: 'GET',
            headers: TMDB_CONFIG.HEADERS
        });
        const data = await response.json();
        return data.results;
    }
    catch (error) {
        console.error("Error fetching movies: ", error);
        throw error;
    }
};



// const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YzZmNWZjMmMyODhmZDdkMWFmODg5NjkyODczMDdhNCIsIm5iZiI6MTc1NjgxMzIwOS4zMjksInN1YiI6IjY4YjZkNzk5N2M4M2NiYzM5OTllMjYxNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iYmsd0z4Iid0xqOlazs1IEYVTZjVapJUg2IJwFjC5-Y'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));