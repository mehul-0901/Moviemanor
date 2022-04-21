import React, {useEffect, useState} from "react";
import '../App.css';
import queries from '../queries';
import {useQuery} from '@apollo/client';
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

    // const[title,setSearchTerm]=useState("");
    let card=null;
    const classes = useStyles();

    const {loading, error, data, refetch} = useQuery(
        queries.GET_MOVIES,
        {
            fetchPolicy:"cache-and-network",
             
        }
      );
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
                <IconButton aria-label="settings">
                  <MoreVertIcon />
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
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
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



