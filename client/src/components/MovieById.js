import { Link, useParams,useNavigate } from 'react-router-dom';
import '../App.css';
import queries from '../queries';
import {useLazyQuery, useQuery} from '@apollo/client';
import { useEffect ,useContext} from 'react';
import {AuthContext} from '../firebase/Auth';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import noImage from '../img/download.jpeg';


const useStyles = makeStyles({
	
	card: {
		maxWidth: 500,
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

    if(data)
    {
        return(
<div className='homeWithoutLogin'>
	<br/><br/><br/>
<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={data.movieById.title} />
				<CardMedia
					className={classes.media}
					component='img'
					image={data.movieById.image!="0"?data.movieById.image:noImage  }
					title='show image'  
				/>

				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
                            
                            <h1>{data.movieById.name}</h1>
							<p>
								<dt className='title'>Description:</dt>
								{data.movieById && data.movieById.plot ? <dd>{data.movieById.plot}</dd> : <dd>N/A</dd>}
							</p>
						
						</dl>
					</Typography>
				</CardContent>
			</Card>
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