import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes} from 'react-router-dom';
import React, {useState} from 'react';
import Home from './components/Home';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';


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
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  
  
	const isMenuOpen = Boolean(anchorEl);
	const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  
	const handleProfileMenuOpen = (event) => {
	  setAnchorEl(event.currentTarget);
	};
  
	const handleMobileMenuClose = () => {
	  setMobileMoreAnchorEl(null);
	};
  
	const handleMenuClose = () => {
	  setAnchorEl(null);
	  handleMobileMenuClose();
	};
  
	const handleMobileMenuOpen = (event) => {
	  setMobileMoreAnchorEl(event.currentTarget);
	};
  
	const handleChange=(e)=>
	{
		 setSearchTerm(e.target.value);
		//   console.log(props.searchTerm)
		  // props.searchValue(e.target.value);
		  console.log("Hell");
		  console.log(e.target.value);

	}
	const menuId = 'primary-search-account-menu';
	const renderMenu = (
	  <Menu
		anchorEl={anchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		id={menuId}
		keepMounted
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		open={isMenuOpen}
		onClose={handleMenuClose}
	  >
		<MenuItem onClick={handleMenuClose}>Profile</MenuItem>
		<MenuItem onClick={handleMenuClose}>My account</MenuItem>
	  </Menu>
	);
  
	const mobileMenuId = 'primary-search-account-menu-mobile';
	const renderMobileMenu = (
	  <Menu
		anchorEl={mobileMoreAnchorEl}
		anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
		id={mobileMenuId}
		keepMounted
		transformOrigin={{ vertical: 'top', horizontal: 'right' }}
		open={isMobileMenuOpen}
		onClose={handleMobileMenuClose}
	  >
		<MenuItem>
		  <IconButton aria-label="show 4 new mails" color="inherit">
			<Badge badgeContent={4} color="secondary">
			  <MailIcon />
			</Badge>
		  </IconButton>
		  <p>Messages</p>
		</MenuItem>
		<MenuItem>
		  <IconButton aria-label="show 11 new notifications" color="inherit">
			<Badge badgeContent={11} color="secondary">
			  <NotificationsIcon />
			</Badge>
		  </IconButton>
		  <p>Notifications</p>
		</MenuItem>
		<MenuItem onClick={handleProfileMenuOpen}>
		  <IconButton
			aria-label="account of current user"
			aria-controls="primary-search-account-menu"
			aria-haspopup="true"
			color="inherit"
		  >
			<AccountCircle />
		  </IconButton>
		  <p>Profile</p>
		</MenuItem>
	  </Menu>
	);

  return (
    <ApolloProvider client = {client}>
		<Router>
			<div className='App'>
				<header className='App-header'>
				<div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Typography className={classes.title} variant="h5" noWrap>
            Moviemanor
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
			
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleChange}
            />
            				{/* <input autoComplete='off' type='text' name='searchTerm' onChange={handleChange} /> */}

          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>

				</header>

				<br />
				<br />

				<div className='App-body'>
					<Routes>
						<Route exact path='/' element={<Home searchTerm={searchTerm}/>} />
					</Routes>
				</div>
			</div>
		</Router>
    </ApolloProvider>
  );
}

export default App;