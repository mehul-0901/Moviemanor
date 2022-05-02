import { Link, useParams,useNavigate } from 'react-router-dom';
import '../App.css';
import queries from '../queries';
import {useLazyQuery, useQuery} from '@apollo/client';
import { useEffect ,useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader ,Box} from '@material-ui/core';
import noImage from '../img/download.jpeg';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import { blue,red } from '@mui/material/colors';


const useStyles = makeStyles({
	
	card: {
		maxWidth: 700,
		height: 'auto',
		marginLeft: 'auto', 
		marginRight: 'auto',
		marginTop:'10rem',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
		fontSize: 'x',

		},
		title:{
			fontSize:"xx-large",
			font:'bold'
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
	},
	
});

function MovieById()
{
    const classes = useStyles();

    const {id}=useParams();
    const {currentUser} = useContext(AuthContext);

    const [getMoviesById, {loading, error, data}] = useLazyQuery(
        queries.GET_MOVIES_BY_ID,
        {
            fetchPolicy:"cache-and-network",
        }
      );
      useEffect(() => {
		console.log('on load useeffect');
        console.log(id);
		async function fetchData() 
        {
            if(currentUser)
            {
                console.log(currentUser.email);
                getMoviesById({variables:{id:id}});
                console.log(data);
            }
		}
		fetchData();

    }	, [id]);

    if(data && currentUser)
    {
        return(
			<div className='homeWithoutLogin'>
			<br/><br/><br/>
			<Card className={classes.card} variant='outlined' style={{marginBottom: "10rem"}}>
				<CardHeader className={classes.titleHead} classes={{title:classes.title}} title={data.movieById.title} avatar={
                <Avatar sx={{ bgcolor: data.movieById.adult ? red[500] : blue[500] ,width: 55, height: 55,fontSize:"small"}} aria-label="recipe">
                  {data.movieById.adult?"ADULT MOVIE":"FAMILY MOVIE"}
                </Avatar>
              } action={<Box
     			 sx={{
     		   		width: 200,
					sizeWidth:800,
     			   alignItems: 'center',
					alignSelf:'center',
					marginTop:'0.5cm',
    			  }}>
      			<Rating
        			name="text-feedback"
        			value={Number(data.movieById.imDbRating)/2}
        			readOnly
        			precision={0.5}
        			emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
					size='large'
      			/>
    			</Box>} ></CardHeader>
				
				
				<CardMedia
					className={classes.media}
					component='img'
					image={data.movieById.image!=="0"?data.movieById.image:noImage  }
					title='show image'  
				/>

				<CardContent>
					
				<Typography className='tagline'>
					<div className='tagline'> {data.movieById.tagline}</div>
				</Typography>
				
					<Typography variant='body2' color='textPrimary' component='span'>
						<dl>
                            
                            <h1>{data.movieById.name}</h1>
							<p>
								<dt className='title'>Description:</dt><br></br>
								{data.movieById && data.movieById.plot ? <dd>{data.movieById.plot}</dd> : <dd>N/A</dd>}
							</p>
						
						</dl>
					</Typography>
					<Typography >
					<div className='releaseDate' >Release Date : {data.movieById.releaseDate}</div>
				</Typography>
					<Link to={"/"} style={{textDecoration: "none", color: "brown"}}>Back to all shows...</Link>

				</CardContent>
			</Card>
			<br />
		</div>
        );
    }
    else
    {
        return(
            <div>Error</div>
        );
    }
}
export default MovieById;