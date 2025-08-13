// my key
const searchBtn = document.querySelector("header .search");
const nameInput = document.querySelector("header .movie-name");
const moviesList = document.querySelector("header .movies-list");
const key = "f9d93d7e";

movieSearch();

function movieSearch() {
  searchBtn.addEventListener("click", () => {
    if (nameInput.value == "") return;
    moviesList.innerText = "";
    getData(nameInput.value);
  });
  nameInput.addEventListener("input", () => {
    if (nameInput.value == "") return;
    moviesList.innerText = "";
    getData(nameInput.value);
  });
}
async function getData(movieName) {
  const movieUrl = `http://www.omdbapi.com/?apikey=${key}&s=${movieName}`;

  try {
    const movieResponse = await fetch(movieUrl);
    if (!movieResponse.ok)
      throw new Error(`Response status: ${movieResponse.status}`);

    const movieResult = await movieResponse.json();
    if (!movieResult.Search) return;

    for (let i = 0; i < movieResult.Search.length; i++) {
      const movieChosen = movieResult.Search[i];
      addToSearchList(
        movieChosen.imdbID,
        movieChosen.Title,
        movieChosen.Year,
        movieChosen.Type,
        movieChosen.Poster
      );
    }
  } catch (error) {
    console.error(error.message);
  }
}
function addToSearchList(id, title, year, type, poster) {
  const movie = document.createElement("button");
  const moviePoster = document.createElement("img");
  const searchInfo = document.createElement("div");
  const movieTitle = document.createElement("h2");
  const movieType = document.createElement("span");
  const movieYear = document.createElement("span");

  movie.classList.add("movie");
  movie.dataset.id = id;
  movie.dataset.type = type;
  movieType.classList.add("type");
  movieTitle.classList.add("title");
  movieYear.classList.add("year");
  searchInfo.classList.add("search-info");

  poster =
    poster == "N/A" ? "https://placeholdit.com/300x450/515151/999999" : poster;
  moviePoster.src = poster;
  moviePoster.onerror = () =>
    (moviePoster.src = "https://placeholdit.com/300x450/515151/999999");

  movieType.innerText = type;
  movieTitle.innerText = title;
  movieYear.innerText = `(${year})`;

  movie.append(moviePoster);
  movie.append(searchInfo);

  searchInfo.append(movieTitle);
  movieTitle.append(movieYear);

  searchInfo.append(movieType);

  moviesList.append(movie);
}

// For Page
let movieId;
moviesList.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    moviesList.innerText = "";
    getDetailsData(e.target.dataset.id, e.target.dataset.type);
  }
});
async function getDetailsData(id, type) {
  const movieUrl = `http://www.omdbapi.com/?apikey=${key}&i=${id}&type=${type}`;

  try {
    const movieResponse = await fetch(movieUrl);
    if (!movieResponse.ok)
      throw new Error(`Response status: ${movieResponse.status}`);

    const movieResult = await movieResponse.json();
    assignToPage(movieResult);
  } catch (error) {
    console.error(error.message);
  }
}

const pagePoster = document.querySelector("main .poster img");
const pageTitle = document.querySelector("main .title .text");
const pageYear = document.querySelector("main .title .year");
const pageType = document.querySelector("main .general-info .type");
const pageSeasons = document.querySelector("main .general-info .seasons");
const pageLang = document.querySelector("main .general-info .lang");
const pageGenres = document.querySelector("main .genres");
const pageImdb = document.querySelector("main .rating-info .imdb");
const pageVotes = document.querySelector("main .rating-info  .votes");
const pageRated = document.querySelector("main .rating-info  .rated");
const pageRuntime = document.querySelector("main .rating-info  .run-time");
const pageDesc = document.querySelector("main .description");
const pageDirector = document.querySelector("main .cast .director");
const pageWriter = document.querySelector("main .cast .writer");
const pageActor = document.querySelector("main .cast .actor");
function assignToPage(result) {
  result.Poster == "N/A"
    ? (pagePoster.src = "https://placeholdit.com/300x450/515151/999999")
    : (pagePoster.src = result.Poster);

  pageTitle.innerText = result.Title;
  pageYear.innerText = `(${result.Year})`;

  pageType.innerText = result.Type;
  result.totalSeasons
    ? (pageSeasons.innerText = `${result.totalSeasons} seasons`)
    : (pageSeasons.innerText = result.BoxOffice);

  pageLang.innerText = result.Language;

  pageGenres.innerText = "";
  for (let i = 0; i < result.Genre.split(",").length; i++) {
    const li = document.createElement("li");
    li.innerText = result.Genre.split(",")[i];
    pageGenres.append(li);
  }

  pageImdb.innerText = result.imdbRating;
  pageVotes.innerText = `(${result.imdbVotes})`;
  pageRated.innerText = result.Rated;
  pageRuntime.innerText = result.Runtime;

  pageDesc.innerText = result.Plot;
  pageDirector.innerText = result.Director;
  pageWriter.innerText = result.Writer;
  pageActor.innerText = result.Actors;
}
