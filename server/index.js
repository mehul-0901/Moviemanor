
const { ApolloServer, gql } = require('apollo-server');
const { default: axios } = require('axios');
const redis = require('redis');
const client = redis.createClient();
const uuid = require('uuid'); //for generating _id's

let { ObjectId } = require('mongodb');
const mongoCollections = require('../server/config/mongoCollections');
const Movie = mongoCollections.Movie;
const SaveMovie = mongoCollections.SaveMovie;


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
type mID {
    id: String
}
 
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    movieList(title: String): [Movies]
    movieById(id:String):Movies
    checkIfwatched(userId:String) : [String]
    savedMovies(userId:String) : [String]


  }
  type Mutation {
    AddtowacthList(userId:String,movieID:String):mID
    removeFromWatchList(userId:String,movieID:String):Boolean
    AddSaveforLater(userId:String,movieID:String):mID
    removeSaveforLater(userId:String,movieID:String):Boolean
  }

`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Mutation:{
        AddtowacthList:async(_,args)=>{
            if(args.movieID == null){
                return
            }
            const addToWatch = await Movie();
            let watchList = { 
              userId:args.userId,
              movieId:args.movieID
             }
     

            const find_id = await addToWatch.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_id);

            if(find_id){
                throw "Movie is already added in watchlist"
            }
            const insertInfo = await addToWatch.insertOne(watchList);
           
             let new_id = insertInfo.insertedId;
             if (insertInfo.insertedCount === 0) throw 'Unable to add in watchList';
             
    
            let x  = await addToWatch.findOne(new_id);
    
             x._id = (x._id).toString();
    
    
            return {id: x._id};
          
        },
        removeFromWatchList:async(_,args)=>{
            if(args.movieID == null){
                return
            }
            const addToWatch = await Movie();
            let watchList = { 
              userId:args.userId,
              movieId:args.movieID
             }
     

            const find_id = await addToWatch.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_id);

            if(!find_id){
                throw "Movie does not exist in watchlist"
            }
            const deletionInfo = await addToWatch.deleteOne(watchList);
          // console.log(deletionInfo);
            if (deletionInfo.deletedCount === 0) {
                throw 'Could not delete restaurants with given id';
              }
              return deletionInfo.acknowledged;
        },

        AddSaveforLater:async(_,args)=>{
            if(args.movieID == null){
                return
            }
            const saveForLater = await SaveMovie();
            let saveList = { 
              userId:args.userId,
              movieId:args.movieID
             }
     

            const find_id = await saveForLater.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_id);

            if(find_id){
                throw "Movie is already saved"
            }
            const insertInfo = await saveForLater.insertOne(saveList);
           
             let new_id = insertInfo.insertedId;
             if (insertInfo.insertedCount === 0) throw 'Unable to add in saveList';
             
    
            let x  = await saveForLater.findOne(new_id);
    
             x._id = (x._id).toString();
    
    
            return {id: x._id};
          
        },

        removeSaveforLater:async(_,args)=>{
            if(args.movieID == null){
                return
            }
            const saveForLater = await SaveMovie();
            let saveList = { 
              userId:args.userId,
              movieId:args.movieID
             }
     

            const find_id = await saveForLater.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_id);

            if(!find_id){
                throw "Movie does not exist in saveList"
            }
            const deletionInfo = await saveForLater.deleteOne(saveList);
          // console.log(deletionInfo);
            if (deletionInfo.deletedCount === 0) {
                throw 'Could not delete restaurants with given id';
              }
              return deletionInfo.acknowledged;
        },
































    },
    Query:{
        movieList: async (_, args) => {
        
            // const {data}= await axios.get(`https://imdb-api.com/API/AdvancedSearch/k_plhfxwj8?title_type=feature&title=${args.title}`);
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
            //     temp["title"]=x.title;
            //     temp["image"]=x.poster_path;
            //    // temp["description"]=x.overview;
            //     temp["plot"]=x.overview;
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
//list of movies watched by user
          checkIfwatched: async (_, args) => {
            const addToWatch = await Movie();
            let array = []
            const find_ids = await addToWatch.find({  userId: args.userId } ).toArray();
           // const find_id = await addToWatch.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_ids);
            if(find_ids.length === 0) return [];
            
            for(list in find_ids ){
             //   console.log("*",list);
                array.push(find_ids[list].movieId)
            }
            return array;
          },

          


          savedMovies: async (_, args) => {
            const saveForLater = await SaveMovie();
            let array = []
            const find_ids = await saveForLater.find({  userId: args.userId } ).toArray();
           // const find_id = await saveForLater.findOne({userId:args.userId, movieId:args.movieID});
            //console.log(find_ids);
            if(find_ids.length === 0) return [];
            
            for(list in find_ids ){
             //   console.log("*",list);
                array.push(find_ids[list].movieId)
            }
            return array;
          }




















       
        //   movieById: async (_, args) => {
        
        //     const {data}= await axios.get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=279284daf2704eb941bfa86708c00a4f&language=en-US`);
          
        //     let arr=[]
        //     if(data.results){  
        //         let temp={};
        //         if(x.id)
        //         {
        //             temp["id"]=x.id;
        //         }
        //         else{
        //             temp["id"]="0";
        //         }
        //         if(x.title)
        //         {
        //             temp["title"]=x.title;
        //         }
        //         else{
        //             temp["title"]="0";
        //         }if(x.poster_path)
        //         {
        //             temp["image"]="https://image.tmdb.org/t/p/w500"+x.poster_path;
        //         }
        //         else{
        //             temp["image"]="0";
        //         }if(x.overview)
        //         {
        //             temp["plot"]=x.overview;
        //         }
        //         else{
        //             temp["plot"]="0";
        //         }
        //     //     temp["title"]=x.title;
        //     //     temp["image"]=x.poster_path;
        //     //    // temp["description"]=x.overview;
        //     //     temp["plot"]=x.overview;
        //     if(x.vote_average){
        //         temp["imDbRating"]=x.vote_average;
        //        }
        //        else
        //        {
        //            temp["imDbRating"]="0"
        //        } arr.push(temp);
        //     }}
            
        //   },
       


          
    },



    };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
