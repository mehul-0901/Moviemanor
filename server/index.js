
const { ApolloServer, gql } = require('apollo-server');
const { default: axios } = require('axios');
const {v4:uuid} = require('uuid');
const {ObjectId} = require('mongodb')
const mongoCollections = require('./config/mongoCollections');
const Movie = mongoCollections.Movie;
const SaveMovie = mongoCollections.SaveMovie;
const Comments = mongoCollections.Comments;
const UserImage = mongoCollections.UserImage;
const { UserInputError } = require('apollo-server');
require("dotenv").config()


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

    type movieId {
        id: ID!
    }
    type Comments{
        MovieId: ID!
        comment: [UserComments]
    }
    
    type UserComments{
        id:ID!
        UserID:ID
        comment:String
        like: [String]
        dislike: [String]

    }

    type userImage{ 
        image: String
       }

    type Query {
        movieById(id:String):Movies
        checkIfwatched(userId:String) : [movieId]
        moviesByIds(ids:[String]):[Movies]
        savedMovies(userId:String) : [movieId]
        listOfComments(movieId:String): Comments
        moodBasedMovies(moodId: ID!, pageNum: Int): [Movies]
        movieList(title: String,pageNum:Int): [Movies]
        getUserImage(userId:String): userImage
    }

    type Mutation {
        removeFromWatchList(userId: String, movieID: String): Boolean
        AddtowacthList(userId: String, movieID: String): movieId
        AddSaveforLater(userId: String, movieID: String): movieId
        removeSaveforLater(userId: String, movieID: String): Boolean
        addComments(movieID:String, userID:String, comment:String):Boolean
        addLike(movieID:String,commentID:String, emailID:String):Boolean
        addDislike(movieID:String,commentID:String, emailID:String):Boolean
        addImage(userID:String, image: String): userImage
    }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Mutation:{
        addComments:async(_,args)=>{
            
            if (!args.comment.replace(/\s/g, '').length)
            {
                throw new UserInputError ('COMMENT cannot be empty or just space');
            }
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.userID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{  
            const addToComment = await Comments();
            const MovieIDExist = await addToComment.findOne({MovieId:args.movieID})
            if (MovieIDExist){
                let array=MovieIDExist.comment;
                let temp={id:uuid(),UserID:args.userID,comment:args.comment,like:[],dislike:[]}
                array.push(temp);
                const addMovieCommentToDB=await addToComment.updateOne({MovieId:args.movieID},{$set:{comment:array}});
                if (addMovieCommentToDB.modifiedCount === 0) {
                    throw new UserInputError('Could not add comment');
                }
            }
            else{
                let addMovieComment = {
                    MovieId:args.movieID,
                    comment:[{id:uuid(),UserID:args.userID,comment:args.comment,like:[],dislike:[]}]
                }
                const addMovieCommentToDB = await addToComment.insertOne(addMovieComment)
                if (addMovieCommentToDB.insertedCount === 0) {
                    throw new UserInputError('Unable to add COMMENT');
                }
            }
            return true
        }catch(e){
            if(e.message){
                throw new UserInputError(e.message)
            }
            else{
                throw new Error('INTERNAL SERVER ERROR')
            }
        }
        },

        addLike:async(_,args)=>{

            if (!args.commentID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('COMMENT cannot be empty or just space');
            }
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.emailID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('EMAILID cannot be empty or just space');
            }
            try{
            const addToComment = await Comments();
            const findCommentLike = await addToComment.findOne({comment:{$elemMatch:{id:args.commentID}}},{$elemMatch:{like:args.emailID}});
            let temp=null;
            let like=false;
            if(findCommentLike!=null)
            {
                for (const x of findCommentLike.comment) {
                    if(x.id==args.commentID)
                    {
                        temp=x;
                        break;
                    }
                }
            }
            if(temp!=null)
            {
                for (const x of temp.like) {
                    if(x==args.emailID)
                    {
                        like=true;
                    }
                    
                }
            }
            const findCommentDisike = await addToComment.findOne({comment:{$elemMatch:{id:args.commentID}}},{$elemMatch:{dislike:args.emailID}});
            let temp1=null;
            let dislike=false;
            if(findCommentDisike!=null)
            {
                for (const x of findCommentDisike.comment) {
                    if(x.id==args.commentID)
                    {
                        temp1=x;
                        break;
                    }
                }
            }
            if(temp1!=null)
            {
                for (const x of temp1.dislike) {
                    if(x==args.emailID)
                    {
                        dislike=true;
                    }
                    
                }
            }

            if (!like && !dislike){
                const userLike = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$push:{"comment.$.like":args.emailID}},false, true)
                console.log(userLike);
                if (userLike.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }            
            }

            else if(dislike && !like){
                const userdislikeRemoved = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$pull:{"comment.$.dislike":args.emailID}},false, true)
                if (userdislikeRemoved.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
                const userLike = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$push:{"comment.$.like":args.emailID}},false, true)
                if (userLike.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
            }
            else if(!dislike && like){
                const userdislikeRemoved = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$pull:{"comment.$.like":args.emailID}},false, true)
                if (userdislikeRemoved.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
            }

            return true
        }catch(e){
            if(e.message){
                throw new UserInputError(e.message)
            }
            else{
                throw new Error('INTERNAL SERVER ERROR')
            }
        }
        },



        addDislike:async(_,args)=>{

            if (!args.commentID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('COMMENT cannot be empty or just space');
            }
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.emailID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('EMAILID cannot be empty or just space');
            }
            try{
            const addToComment = await Comments();
            const findCommentLike = await addToComment.findOne({comment:{$elemMatch:{id:args.commentID}}},{$elemMatch:{like:args.emailID}});
            let temp=null;
            let like=false;
            if(findCommentLike!=null)
            {
                for (const x of findCommentLike.comment) {
                    if(x.id==args.commentID)
                    {
                        temp=x;
                        break;
                    }
                }
            }
            if(temp!=null)
            {
                for (const x of temp.like) {
                    if(x==args.emailID)
                    {
                        like=true;
                    }
                    
                }
            }
            const findCommentDisike = await addToComment.findOne({comment:{$elemMatch:{id:args.commentID}}},{$elemMatch:{dislike:args.emailID}});
            let temp1=null;
            let dislike=false;
            if(findCommentDisike!=null)
            {
                for (const x of findCommentDisike.comment) {
                    if(x.id==args.commentID)
                    {
                        temp1=x;
                        break;
                    }
                }
            }
            if(temp1!=null)
            {
                for (const x of temp1.dislike) {
                    if(x==args.emailID)
                    {
                        dislike=true;
                    }
                    
                }
            }

            if (!like && !dislike){
                const userLike = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
            {$push:{"comment.$.dislike":args.emailID}},false, true)
            if (userLike.modifiedCount === 0) {
                throw new UserInputError('Could not LIKE comment');
            }
            console.log("here");
            }

            else if(!dislike && like){
                const userdislikeRemoved = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$pull:{"comment.$.like":args.emailID}},false, true)
                if (userdislikeRemoved.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
                const userLike = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$push:{"comment.$.dislike":args.emailID}},false, true)
                if (userLike.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
            }
            else if(dislike && !like){
                const userdislikeRemoved = await addToComment.updateOne({MovieId:args.movieID, "comment.id":args.commentID},
                {$pull:{"comment.$.dislike":args.emailID}},false, true)
                if (userdislikeRemoved.modifiedCount === 0) {
                    throw new UserInputError('Could not LIKE comment');
                }
            }
            return true
        }catch(e){
            if(e.message){
                throw new UserInputError(e.message)
            }
            else{
                throw new Error('INTERNAL SERVER ERROR')
            }
        }
        },

        AddtowacthList:async(_,args)=>{
            
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
            const addToWatch = await Movie();
            let watchList = { 
              userId:args.userId,
              movieId:args.movieID
            }
            const find_id = await addToWatch.findOne({userId:args.userId, movieId:args.movieID});
            if(find_id){
                throw new Error("Movie is already added in watchlist");
            }
            const insertInfo = await addToWatch.insertOne(watchList);           
            let new_id = insertInfo.insertedId;
            if (insertInfo.insertedCount === 0) {
                throw new Error('Unable to add in watchList');
            }    
            let x  = await addToWatch.findOne(new_id);
            x._id = (x._id).toString();    
            return {id: x._id};
        }catch(e){
            if(e.message){
                throw new UserInputError(e.message)
            }
            else{
                throw new Error('INTERNAL SERVER ERROR')
            }
        }
          
        },
        removeFromWatchList:async(_,args)=>{
            
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
            const addToWatch = await Movie();
            let watchList = { 
              userId:args.userId,
              movieId:args.movieID
            }

            const find_id = await addToWatch.findOne({userId:args.userId, movieId:args.movieID});
            if(!find_id){
                throw new Error('Movie does not exist in watchlist');
            }
            const deletionInfo = await addToWatch.deleteOne(watchList);
            if (deletionInfo.deletedCount === 0) {
                throw new Error('Could not delete restaurants with given id');
            }
            return deletionInfo.acknowledged;
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },

        AddSaveforLater:async(_,args)=>{
            
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
            const saveForLater = await SaveMovie();
            let saveList = { 
              userId:args.userId,
              movieId:args.movieID
            }

            const find_id = await saveForLater.findOne({userId:args.userId, movieId:args.movieID});

            if(find_id){
                throw new Error('Movie is already saved');
            }
            const insertInfo = await saveForLater.insertOne(saveList);
           
            let new_id = insertInfo.insertedId;
            if (insertInfo.insertedCount === 0) {
                throw new Error('Unable to add in saveList');
            }
            let x  = await saveForLater.findOne(new_id);
            x._id = (x._id).toString();
            return {id: x._id};
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },

        removeSaveforLater:async(_,args)=>{
            
            if (!args.movieID.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieID))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
            const saveForLater = await SaveMovie();
            let saveList = { 
              userId:args.userId,
              movieId:args.movieID
            }

            const find_id = await saveForLater.findOne({userId:args.userId, movieId:args.movieID});

            if(!find_id){
                throw new Error('Movie does not exist in saveList')
            }
            const deletionInfo = await saveForLater.deleteOne(saveList);
            if (deletionInfo.deletedCount === 0) {
                throw new Error('Could not delete movie with given id');
            }
            return deletionInfo.acknowledged;
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },

        addImage:async(_,args)=>{
            const getImage = await  UserImage();
        
            const newImage ={
                userId:args.userID,
                userImage:args.image 
            }

            const find_id = await getImage.findOne({userId:args.userID});
            //console.log(find_id);

            if(find_id){
                console.log(find_id);
                let parsedId = ObjectId(find_id._id); 
            console.log(parsedId);
                const updatedProfile = {
                    userId:args.userID,
                    userImage:args.image 
    
                };
                if(args.image === find_id.userImage){
                    return {image: updatedProfile.userImage}
                }
    
                const updatedInfo = await getImage.updateOne(
                    {  _id: parsedId},
                    { $set: updatedProfile }
                );
    
                if (updatedInfo.modifiedCount === 0) {
                    throw 'could not update user image successfully';
                }

                return {image: updatedProfile.userImage}
            }
            else{
            const insertInfo = await getImage.insertOne(newImage);
            if (insertInfo.insertedCount === 0) throw 'Unable to add in saveList';
    
            return {image: newImage.userImage}

            } 
        }

    },

    Query:{
        movieList: async (_, args) => {

            if (typeof (args.pageNum) != 'number')
            {
                throw new UserInputError ('Invalid PAGE NUMBER ');
            }
            if (!args.title.replace(/\s/g, '').length)
            {
                throw new UserInputError ('TITLE cannot be empty or just space');
            }
            try{
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
                    temp["image"]="NA";
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
        }catch(e){
            if(e.message){
                throw new UserInputError(e.message)
            }
            else{
                throw new Error('INTERNAL SERVER ERROR')
            }
        }
        },

        //list of movies watched by user
        checkIfwatched: async (_, args) => {

            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
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
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },

          listOfComments: async(_,args)=>{

            if (!args.movieId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('MOVIEID cannot be empty or just space');
            }
            if (isNaN(args.movieId))
            {
                throw new UserInputError ('Invalid MOVIEID ');
            }
            try{
            const addToComment = await Comments();
            const commentByMovie = await addToComment.find({MovieId: args.movieId}).toArray();
            commentByMovie[0].comment.reverse()
            return commentByMovie[0]
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }

          },


          savedMovies: async (_, args) => {

            if (!args.userId.replace(/\s/g, '').length)
            {
                throw new UserInputError ('USERID cannot be empty or just space');
            }
            try{
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
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },
  
        moviesByIds:async (_, args) => {

            for(id in args.ids){
                if (!args.ids[id].replace(/\s/g, '').length)
                {
                    throw new UserInputError ('USERID cannot be empty or just space');
                }
            }
            try{
            let movieArray = []
            for(id in args.ids){
               // console.log(args.ids[id]);
                const {data}= await axios.get(`https://api.themoviedb.org/3/movie/${args.ids[id]}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
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
                        temp["image"]="NA";
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
            }catch(e){
                if(e.message){
                    throw new UserInputError(e.message)
                }
                else{
                    throw new Error('INTERNAL SERVER ERROR')
                }
            }
        },

        movieById: async (_, args) => {
        
            if (!args.id.replace(/\s/g, '').length)
                {
                    throw new UserInputError ('USERID cannot be empty or just space');
                }
            const {data}= await axios.get(`https://api.themoviedb.org/3/movie/${args.id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
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
                    temp["image"]="NA";
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
            if(args.moodId == 0){
                return [null]
            }
            if(!args.pageNum) {
                args.pageNum = 1
            }
            const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${args.moodId}/similar?api_key=${process.env.TMDB_API_KEY}&page=${args.pageNum}&language=en-US`)
            const moviesArray = []
            console.log(data);
            data.results.forEach(x => {
                let movie = {
                    id: x.id,
                    title: x.title ? x.title : `NA`,
                    image: x.poster_path ? "https://image.tmdb.org/t/p/w500"+x.poster_path : `NA`,
                    plot: x.overview,
                    page: data.total_pages 
                }
                moviesArray.push(movie)
            })
            return moviesArray
        },


        getUserImage: async(_, args) => {

            const getImage = await  UserImage(); 
            const find_image = await getImage.find({  userId: args.userId } ).toArray();
            if(find_image.length === 0) return {};
            let image = {}
            for(list in find_image ){
                image = {image: find_image[list].userImage}
               
            }
            return image;

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
