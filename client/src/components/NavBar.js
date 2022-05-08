import React, {useEffect, useState,useContext} from "react";
import '../App.css';
import { styled, alpha } from '@mui/material/styles';
import {AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { doSignOut } from '../firebase/FirebaseFunctions';
import {BrowserRouter as Router, Route, Link, Routes,NavLink, useNavigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';

 
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.8),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const NavDiv = styled("div")(({ theme }) => ({
    display: "flex",
    margin: "auto",
    width: "auto",
    maxWidth: 1660,
    height: 122,
    borderRadius: 30,
    background: "transparent"
}));

const NavBar = (props) => {
	const [anchorEl, setAnchorEl] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const {currentUser} = useContext(AuthContext);
    const navigate=useNavigate();
    const isMenuOpen = Boolean(anchorEl);
    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    

    const loggedInDiv = (x) => {
        if (x) {
            return (
            <div style={{display: "flex"}}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    id="searchInput"
                    placeholder="Search…"
                    autoComplete="false"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange= {(e) => {
                        props.setSearchTerm(e.target.value)
                        console.log(e.target.value);
                        navigate("/")
                    }}
                    />
                </Search>
                <Link to={"/SavedMovies"}>
                    <IconButton size="large" aria-label={`show ${props.noOfBookmarks} watchlisted movies`} sx={{color: "rgb(52 71 103) !important"}} title="My Watchlist Movies">
                        <Badge badgeContent={props.noOfBookmarks} color="error">
                            <BookmarksIcon />
                        </Badge>
                    </IconButton>
                </Link>
                <Link to={"/WatchList"}>
                    <IconButton size="large" aria-label={`show ${props.noOfWatchedMovies} watched movies`} sx={{color: "rgb(52 71 103) !important"}} title="My Watched Movies">
                        <Badge badgeContent={props.noOfWatchedMovies} color="error">
                            <ListAltIcon />
                        </Badge>
                    </IconButton>
                </Link>
                <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                title="Profile"
                >
                    <AccountCircle />
                </IconButton>
            </div>
            );
        } else {
            return (
                <div style={{ display: "flex", columnGap: "1rem" }}>
                    <Link style={{textDecoration: "none"}} to={"/SignIn"}>
                        <Button variant="contained" sx={{ backgroundColor: "blue", height: 60, width:150, borderRadius: "20px", fontSize: "25px", textDecoration: "none" }} >Sign In </Button>
                    </Link>
                    <Link style={{textDecoration: "none"}} to={"/SignUp"}>
                        <Button variant="contained" sx={{ backgroundColor: "blue", height: 60, width:150, borderRadius: "20px", fontSize: "25px", textDecoration: "none" }} > Sign Up</Button>
                    </Link>
  
                </div>
            );
        }
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
            sx={{marginTop: "4rem", marginLeft: "6rem"}}
        >
        <Link to={"/Profile"} sx={{textDecoration: "none"}}>
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        </Link>
        <Link to={"/SavedMovies"} sx={{textDecoration: "none"}} onClick={handleMenuClose}>
            <MenuItem >My Saved Movies</MenuItem>
        </Link>
        <Link to={"/WatchList"} sx={{textDecoration: "none"}} onClick={handleMenuClose}>
            <MenuItem >My Watched List</MenuItem>
        </Link>
        <Link to={"/"} sx={{textDecoration: "none"}}>
            <MenuItem onClick={(e) => { 
                e.preventDefault()
                props.setSearchTerm("")
                doSignOut() 
                handleMenuClose()
                navigate("/")
                }} >Log out</MenuItem>
        </Link>
        </Menu>
    );

    return (
        <NavDiv className="navbar" sx={{ backgroundColor: alpha("#FFFFFF", 0.15) }}>
            <Toolbar sx={{ columnGap: '25rem', justifyContent: "space-evenly" }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' }, fontSize: "50px !important" }} 
                    fontWeight={"bold"}
                >
                   <Link to={"/"} onClick={(e) => {
                       e.preventDefault()
                       props.setSearchTerm("")
                       props.setMoodId(0)
                       navigate("/")
                       if(currentUser){
                           let searchBox = document.getElementById("searchInput")
                           searchBox.value = ""
                       }
                   }} style={{textDecoration: "none", color: "inherit"}}>
                        Moviemanor  
                   </Link> 
                </Typography>
                {loggedInDiv(currentUser)}
            </Toolbar>
            {renderMenu}
        </NavDiv>
    );
}

export default NavBar;