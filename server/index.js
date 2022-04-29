
const { ApolloServer, gql } = require('apollo-server');
const { default: axios } = require('axios');
const redis = require('redis');
const client = redis.createClient();
const uuid = require('uuid'); //for generating _id's

// const { default: axios } = require('axios');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// (async () => {
//     // const client = createClient();
  
//     client.on('error', (err) => console.log('Redis Client Error', err));
  
//     await client.connect();
  
//   })();
  
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Movies {
    id: ID!
    title: String!
    image: String!
    plot:String!
    imDbRating:String!
}
 
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    movieList(title: String): [Movies]
    movieById(id:String):Movies
  }

`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query:{
        movieList: async (_, args) => {
        
            const {data}= await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=279284daf2704eb941bfa86708c00a4f&page=1&query=${args.title}`);
            if(args.title==undefined)
            {
                return [];
            }
            let arr=[]
          if(data.results){  
              for(let x of data.results)
            {
                let temp={};
                if(x.id)
                {
                    temp["id"]=x.id;
                }
                else{
                    temp["id"]="0";
                }
                if(x.title)
                {
                    temp["title"]=x.title;
                }
                else{
                    temp["title"]="0";
                }if(x.poster_path)
                {
                    temp["image"]="https://image.tmdb.org/t/p/w500"+x.poster_path;
                }
                else{
                    temp["image"]="0";
                }if(x.overview)
                {
                    temp["plot"]=x.overview;
                }
                else{
                    temp["plot"]="0";
                }
            if(x.vote_average){
                temp["imDbRating"]=x.vote_average;
               }
               else
               {
                   temp["imDbRating"]="0"
               } arr.push(temp);
            }}
            return arr;
          },
       
          movieById: async (_, args) => {
        
            const {data}= await axios.get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=279284daf2704eb941bfa86708c00a4f&language=en-US`);
            let temp={};

            if(data){  
                if(data.id)
                {
                    temp["id"]=data.id;
                }
                else{
                    temp["id"]="0";
                }
                if(data.title)
                {
                    temp["title"]=data.title;
                }
                else{
                    temp["title"]="0";
                }if(data.poster_path)
                {
                    temp["image"]="https://image.tmdb.org/t/p/w500"+data.poster_path;
                }
                else{
                    temp["image"]="0";
                }if(data.overview)
                {
                    temp["plot"]=data.overview;
                }
                else{
                    temp["plot"]="0";
                }
            
            if(data.vote_average){
                temp["imDbRating"]=data.vote_average;
               }
               else
               {
                   temp["imDbRating"]="0"
               } 
            }
            
            return temp;
          },
       


          
    },



    };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
