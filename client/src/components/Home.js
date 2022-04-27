import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {useQuery, useMutation} from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import BookmarkRemoveSharpIcon from '@mui/icons-material/BookmarkRemoveSharp';
import {AuthContext} from '../firebase/Auth';

import { makeStyles } from '@material-ui/core';

import MoreVertIcon from '@mui/icons-material/MoreVert';


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

    const {loading, error, data, refetch} = useQuery(
        queries.GET_MOVIES,
        {
            fetchPolicy:"cache-and-network", 
        }
      );

     const [addToWatchList] = useMutation(queries.ADD_TOWATCHLIST)
     const [removefromWatchList] = useMutation(queries.REMOVE_FROM_WATCHLIST)
     const [addToSave] = useMutation(queries.ADD_SAVEFORLATER)
     const [removefromSave] = useMutation(queries.REMOVE_SAVEFORLATER)


     
    const {data: data1} =useQuery(queries.GET_USER_WATCHEDMOVIES, {
      variables: { userId:currentUser.email}
    })
   // console.log(data1);
    const set = new Set(data1?.checkIfwatched);

    const {data: data2} =useQuery(queries.GET_USER_SAVEDMOVIES, {
      variables: { userId:currentUser.email}
    })
    //console.log(data1);
    const set_SAVE = new Set(data2?.savedMovies);





    //  const {data:data1} = useQuery(
    //   queries.CHECK_IF_WATCHED,
    //   {
    //       fetchPolicy:"cache-and-network", 
    //   }
    // );
     

    useEffect(() => {
		console.log('on load useeffect ====='+props.searchTerm);
        // setSearchTerm(props.searchTerm);
		async function fetchData() 
        {
            refetch({"title":props.searchTerm}); 
            console.log("i am here ");
            refetch({"title":props.searchTerm});
		}
		fetchData();
        console.log(data);


    }	, [props.searchTerm]);


    const buildCard = (show) => {
        return (
            <div>
          <Card  className={classes.card} sx={{ maxWidth: 345 }} >
            <CardHeader 
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {show.title.charAt(0)}
                </Avatar>
              }
              action={
                <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
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
         

              {set_SAVE.has(show.id)? 
            
                <IconButton aria-label="Remove saved movie" 
                onClick={(e) => {
                  // console.log(show);
                  removefromSave({
                           variables: { userId:currentUser.email, movieId: show.id}
                        })
                        window.location.reload();
                 }}>
                 <BookmarkRemoveSharpIcon/>
                </IconButton>
    
               :
    
               <IconButton aria-label="Save for later" 
               onClick={(e) => {
                // console.log(show);
                addToSave({
                         variables: { userId:currentUser.email, movieId: show.id}
                      })
                      window.location.reload();
               }}>
               <BookmarkBorderIcon  />
               </IconButton>
              
              } 
            </CardActions>
            <CardActions disableSpacing>

            {set.has(show.id)? 
            
            <IconButton aria-label="Delete watchlist"
            onClick={(e) => {
              // console.log(show);
              removefromWatchList({
                       variables: { userId:currentUser.email, movieId: show.id}
                    })
                    window.location.reload();
             }}>
              <RemoveCircleOutlineSharpIcon />
            </IconButton>

           :

           <IconButton aria-label="Add to watchlist" 
           onClick={(e) => {
            // console.log(show);
                   addToWatchList({
                     variables: { userId:currentUser.email, movieId: show.id}
                  })
                  window.location.reload();
           }}>
             <AddIcon />
           </IconButton>
          
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
    console.log(data);
  if(data.movieList!=null)
  {
    console.log("HELOO DUNIYA ");
    card =
    data &&
    data.movieList.map((show) => {
        if(show!=null){
        return (buildCard(show));
    }});
  }

}


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



