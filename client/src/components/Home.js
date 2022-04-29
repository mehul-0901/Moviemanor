import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import BookmarkRemoveSharpIcon from '@mui/icons-material/BookmarkRemoveSharp';
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import { Button } from "@mui/material";


const useStyles = makeStyles({
	card: {
		maxWidth: 300,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const Home = (props) => {

  const {currentUser} = useContext(AuthContext);
    // const[title,setSearchTerm]=useState("");
    let card=null;
    const classes = useStyles();

    const [getAllMovies,{loading, error, data, refetch}] = useLazyQuery(
        queries.GET_MOVIES,
        {
            fetchPolicy:"cache-and-network", 
        }
      );

     const [addToWatchList] = useMutation(queries.ADD_TOWATCHLIST)
     const [removefromWatchList] = useMutation(queries.REMOVE_FROM_WATCHLIST)
     const [addToSave] = useMutation(queries.ADD_SAVEFORLATER)
     const [removefromSave] = useMutation(queries.REMOVE_SAVEFORLATER)

 
     
    const [getUserWatchedMovies,{data: data1,refetch:refetchWatched}] =useLazyQuery(queries.GET_USER_WATCHEDMOVIES, {});
   // console.log(data1);

    const [getUserSavedMovies,{data: data2,refetch:refetchSaved}] =useLazyQuery(queries.GET_USER_SAVEDMOVIES,{});
    //console.log(data1);


    useEffect(() => {
		console.log('on load useeffect ====='+props.searchTerm);
        // setSearchTerm(props.searchTerm);
		async function fetchData() 
        {
            console.log("i am here ");
            if(currentUser)
            {
              getAllMovies({variables:{"title":props.searchTerm}}); 
              getUserWatchedMovies({variables: { userId:currentUser.email}});
              getUserSavedMovies({ variables: { userId:currentUser.email}});
            }
            console.log(data1);
            console.log(data2); 
         }
		fetchData();

    }	, [props.searchTerm]);

    const removeWatchList=(email,id)=>
    {
      removefromWatchList({
        variables: { userId:email, movieId: id},
        onCompleted: refetchWatched
     });
     getUserWatchedMovies({variables: { userId:currentUser.email}});
    }
    const addWatchList=(email,id)=>{
      
      addToWatchList({
        variables: { userId:email, movieId: id},
        onCompleted: refetchWatched
     });
     getUserWatchedMovies({variables: { userId:currentUser.email}});
    }
    const removeSave=(email,id)=>
    {
      removefromSave({
        variables: { userId:email, movieId: id},
        onCompleted: refetchSaved
     })
     getUserSavedMovies({ variables: { userId:currentUser.email}});
    }
    const addSave=(email,id)=>
    {
                addToSave({
                  variables: { userId:email, movieId:id},
                  onCompleted: refetchSaved
               })
               getUserSavedMovies({ variables: { userId:currentUser.email}});
    }


    const buildCard = (show,save,wishList) => {
        return (
            <div key={show.id}>
          <Card  className={classes.card} sx={{ maxWidth: 345 }} >
            <CardHeader 
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {show.title.charAt(0)}
                </Avatar>
              }
              title={show.title}
            />
            <CardMedia
              component="img"
              height="400"
              image={show.image}
              alt={show.title}
            />
            <CardActions disableSpacing>
              {save? 
            
                <Button aria-label="Remove saved movie" 
                onClick={() => {removeSave(currentUser.email,show.id)}}>
                 <BookmarkRemoveSharpIcon/> Remove from Save
                </Button>
               :
               <Button aria-label="Save for later" 
               onClick={() => {addSave(currentUser.email,show.id)}}>
               <BookmarkBorderIcon  /> Add to Save
               </Button>
              
              } 
            </CardActions>
            <CardActions >

            {wishList? 
            <Button aria-label="Delete watchlist"
            onClick={(e) => {removeWatchList(currentUser.email,show.id) }}>
              <RemoveCircleOutlineSharpIcon />Delete from watchlist
            </Button>
           :
           <Button aria-label="Add to watchlist" 
           onClick={(e) => {addWatchList(currentUser.email,show.id)}}>
             <AddIcon /> Add to watchlist
           </Button>
          
          }
          </CardActions>

              <CardContent>
                <Typography variant='body2' color='textSecondary' component='span'>
                  {show.plot}
                </Typography>
              </CardContent>
          </Card>
          <br></br>
          </div>
        );
      
      }
    

    if (data)
{
  if(data.movieList!==null)
  {    
    card =
    data &&
    data.movieList.map((show) => {
        if(show!==null){
       
        let save=false;
        let wishList=false;
          for (const x of data2.savedMovies) {
            if(x.id===show.id)
            {
              save=true;
            }
          }
          for (const x of data1.checkIfwatched) {
            if(x.id===show.id)
            {
              wishList=true;
            }
          }
        return (buildCard(show,save,wishList));
    } else {
      return null
    }});
  }

}

  console.log("Data from searching", data);
    return(
        <div className="homeWithoutLogin">
            <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", marginTop: "20rem", width: "100%"}}>
              <h1 style={{ color: "white"}}>Moviemanor</h1>
              {card} 
              
            </div>
        </div>
    );
}

export default Home;



