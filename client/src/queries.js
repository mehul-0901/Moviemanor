import {gql} from '@apollo/client';

const GET_MOVIES = gql`
query Query($title: String) {
    movieList(title: $title) {
      id
      title
      image
      
      plot
      imDbRating
    }
  }
  
`;



let exported = {
  GET_MOVIES,
  };
  
export default exported
