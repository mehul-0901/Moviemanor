
const { ApolloServer, gql } = require('apollo-server');
const { default: axios } = require('axios');
const redis = require('redis');
const client = redis.createClient();
const uuid = require('uuid'); //for generating _id's
const mongoCollections = require('../server/config/mongoCollections');
const Movie = mongoCollections.Movie;
const SaveMovie = mongoCollections.SaveMovie;
const Comments = mongoCollections.Comments;



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
    type Movies {
        id: ID!
        title: String!
        image: String!
        plot: String!
        tmDbRating: String!
        page: Int
        tagline: String
        releaseDate: String
        adult: Boolean
    }

type Comments{
    MovieId:ID!
    comment: [UserComments]
}
type UserComments{
    UserID:ID
    comment:String

}
    movieList(title: String,pageNum:Int): [Movies]
  type Query {
    movieById(id:String):Movies
    checkIfwatched(userId:String) : [mID]
    moviesByIds(ids:[String]):[Movies]
    savedMovies(userId:String) : [mID]
    listOfComments(movieId:String): Comments
        moodBasedMovies(moodId: ID!): [Movies]
    }

    type Mutation {
        removeFromWatchList(userId: String, movieID: String): Boolean
        AddtowacthList(userId: String, movieID: String): movieID
        AddSaveforLater(userId: String, movieID: String): movieID
        removeSaveforLater(userId: String, movieID: String): Boolean
    addComments(movieID:String, userID:String, comment:String):Boolean
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Mutation:{
        addComments:async(_,args)=>{
            
            const addToComment = await Comments();
            const MovieIDExist = await addToComment.findOne({MovieId:args.movieID})
            if (MovieIDExist){
                let array=MovieIDExist.comment;
                console.log(MovieIDExist);
                let temp={UserID:args.userID,comment:args.comment}
                array.push(temp);
                const addMovieCommentToDB=await addToComment.updateOne({MovieId:args.movieID},{$set:{comment:array}});
            }
            else{
                let addMovieComment = {
                    MovieId:args.movieID,
                    comment:[{UserID:args.userID,comment:args.comment}]
                }
                const addMovieCommentToDB = await addToComment.insertOne(addMovieComment)
            }
            return true
        },
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
                throw 'Could not delete movie with given id';
            }
            return deletionInfo.acknowledged;
        },
    },

    Query:{
        movieList: async (_, args) => {
            const {data}= await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=279284daf2704eb941bfa86708c00a4f&page=${args.pageNum}&query=${args.title}&language=en-US`);
            if(args.title==undefined)
            {
                return [];
            }
            let arr=[]
            if(data.results){  
              for(let x of data.results) {
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
                    temp["title"]="NA";
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
                    temp["plot"]="NA";
                }
         
            if(x.vote_average){
                temp["tmDbRating"]=x.vote_average;
               }
               else
               {
                   temp["tmDbRating"]="NA"
               } 
               temp["page"]=data.total_pages;
               arr.push(temp);
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
                array.push({id: find_ids[list].movieId})
            }
            return array;
          },

          listOfComments: async(_,args)=>{

            const addToComment = await Comments();
            const commentByMovie = await addToComment.find({MovieId: args.movieId}).toArray();
            // console.log(commentByMovie[0].comment);
            // let array=[];
            // for (const x of commentByMovie[0].comment) {
            //     // console.log(x.UserID+"      "+x.comment);
            //     array.push({UserID:x.UserID,comment:x.comment});
            // }

            // let temp={}
            // temp["MovieId"]=commentByMovie[0].MovieId;
            // temp["comment"]=array;
            // console.log(temp);
            return commentByMovie[0]

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
                array.push({id:find_ids[list].movieId})
            }
            return array;
        },
  
        moviesByIds:async (_, args) => {
            let movieArray = []
            for(id in args.ids){
               // console.log(args.ids[id]);
                const {data}= await axios.get(`https://api.themoviedb.org/3/movie/${args.ids[id]}?api_key=279284daf2704eb941bfa86708c00a4f&language=en-US`);
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
                    temp["tmDbRating"]=data.vote_average;
                   }
                   else
                   {
                       temp["tmDbRating"]="0"
                   } 
                }
                movieArray.push(temp)
            }
            return movieArray
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
                temp["tmDbRating"]=data.vote_average;
               }
               else
               {
                   temp["tmDbRating"]="0"
               } 
               if(data.tagline)
               {
                   temp["tagline"]=data.tagline;
               }
               else{
                temp["tagline"]="";
            }
            if(data.release_date)
            {
                temp["releaseDate"]=data.release_date;
            }
            else
            {
                temp["releaseDate"]=""
            }
            if(data.adult==true || data.adult==false){
                temp["adult"]=data.adult;
            }
            else{
                temp["adult"]=true;
            }
            }
            return temp;
        },

        moodBasedMovies: async(_, args) => {
            if(!args.pageNum) {
                args.pageNum = 1
            }
            const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${args.moodId}/similar?api_key=279284daf2704eb941bfa86708c00a4f&page=${args.pageNum}&language=en-US`)
            const moviesArray = []
            console.log(data);
            data.results.forEach(x => {
                let movie = {
                    id: x.id,
                    title: x.title ? x.title : `NA`,
                    image: x.poster_path ? x.poster_path : `NA`,
                    plot: x.overview ? x.overview : `NA`,
                    page: data.page 
                }
                moviesArray.push(movie)
            })
            return moviesArray
        }
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
