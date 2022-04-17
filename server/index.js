
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
    description: String!
    plot:String!
    imDbRating:String!
}
 
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    movieList(title: String): [Movies]
  }

`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query:{
        movieList: async (_, args) => {
            const {data}= await axios.get(`https://imdb-api.com/API/AdvancedSearch/k_0im3ok11?title_type=feature&title=${args.title}`);
            console.log(data.results);
            let arr=[]
            for(let x of data.results)
            {
                let temp={};
                temp["id"]=x.id;
                temp["title"]=x.title;
                temp["image"]=x.image;
                temp["description"]=x.description;
                temp["plot"]=x.plot;
                temp["imDbRating"]=x.imDbRating;
                arr.push(temp);
            }
            return arr;
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
