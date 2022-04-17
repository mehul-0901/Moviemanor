import logo from './logo.svg';
import './App.css';
import Home from './components/Home';
import NavBar from './components/NavBar';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState} from 'react';
import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
// import AppBar from '@mui/icons-material/AppBar';
// import Toolbar from '@mui/icons-material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/icons-material/Typography';
// import InputBase from '@mui/icons-material/InputBase';
import Badge from '@mui/icons-material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  useQuery
} from "@apollo/client";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

const useStyles = makeStyles((theme) => ({
	grow: {
	  flexGrow: 1,
	},
	menuButton: {
	  marginRight: theme.spacing(2),
	},
	title: {
	  display: 'none',
	  [theme.breakpoints.up('sm')]: {
		display: 'block',
	  },
	},
	search: {
	  position: 'relative',
	  borderRadius: theme.shape.borderRadius,
	  backgroundColor: alpha(theme.palette.common.white, 0.15),
	  '&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	  },
	  marginRight: theme.spacing(2),
	  marginLeft: 0,
	  width: '100%',
	  [theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	  },
	},
	searchIcon: {
	  padding: theme.spacing(0, 2),
	  height: '100%',
	  position: 'absolute',
	  pointerEvents: 'none',
	  display: 'flex',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	inputRoot: {
	  color: 'inherit',
	},
	inputInput: {
	  padding: theme.spacing(1, 1, 1, 0),
	  // vertical padding + font size from searchIcon
	  paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
	  transition: theme.transitions.create('width'),
	  width: '100%',
	  [theme.breakpoints.up('md')]: {
		width: '20ch',
	  },
	},
	sectionDesktop: {
	  display: 'none',
	  [theme.breakpoints.up('md')]: {
		display: 'flex',
	  },
	},
	sectionMobile: {
	  display: 'flex',
	  [theme.breakpoints.up('md')]: {
		display: 'none',
	  },
	},
  }));

function App() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <ApolloProvider client = {client}>
      <Router>
        <div className="App">
          <NavBar setSearchTerm={setSearchTerm}/>
          <div className='App-body'>
            <Routes>
              <Route path='/' element={ <Home searchTerm={searchTerm}/> } />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;