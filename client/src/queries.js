import {gql} from '@apollo/client';

const GET_MOVIES = gql`
query MovieList($title: String, $pageNum: Int) {
  movieList(title: $title, pageNum: $pageNum) {
    id
    title
    plot
    image
    imDbRating
    page
  }
}
  
`;

const GET_MOVIES_BY_ID=gql`
query MovieById($id: String) {
  movieById(id: $id) {
    id
    title
    image
    plot
    imDbRating
  }
}
`

const Get_Movies_By_IDS =  gql`
query MoviesByIds($ids: [String]) {
  moviesByIds(ids: $ids) {
    id
    title
    image
    description
    plot
    imDbRating
  }
}

`

const GET_USER_WATCHEDMOVIES = gql`
query CheckIfwatched($userId: String) {
  checkIfwatched(userId: $userId) {
    id
  }
} 
`;

const GET_USER_SAVEDMOVIES = gql`
query SavedMovies($userId: String) {
  savedMovies(userId: $userId) {
    id
  }
}
  
`;




const ADD_TOWATCHLIST = gql`
mutation AddtowacthList($userId: String, $movieId: String) {
  AddtowacthList(userId: $userId, movieID: $movieId) {
    id
  }
}
  
`;

const REMOVE_FROM_WATCHLIST = gql`
mutation RemoveFromWatchList($userId: String, $movieId: String) {
  removeFromWatchList(userId: $userId, movieID: $movieId)
}
`;

const ADD_SAVEFORLATER = gql`
mutation AddSaveforLater($userId: String, $movieId: String) {
  AddSaveforLater(userId: $userId, movieID: $movieId) {
    id
  }
}
`;

const REMOVE_SAVEFORLATER = gql`
mutation RemoveSaveforLater($userId: String, $movieId: String) {
  removeSaveforLater(userId: $userId, movieID: $movieId)
}
`;







let exported = {
  GET_MOVIES,
  ADD_TOWATCHLIST,
  GET_USER_WATCHEDMOVIES,
  REMOVE_FROM_WATCHLIST,
  GET_USER_SAVEDMOVIES,
  ADD_SAVEFORLATER,
  REMOVE_SAVEFORLATER, 
  GET_MOVIES_BY_ID,
  Get_Movies_By_IDS
  };
  
export default exported
