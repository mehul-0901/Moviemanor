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

let exported = {
  GET_MOVIES,
  GET_MOVIES_BY_ID
  };
  
export default exported
