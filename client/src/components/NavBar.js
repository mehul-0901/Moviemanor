import React, {useEffect, useState} from "react";
import '../App.css';
import { styled, alpha } from '@mui/material/styles';
import {AppBar, Box, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Button} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from "react-router-dom";


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
    minHeight: 122,
    height: 122,
    borderRadius: 30,
    background: "transparent"
}));

const NavBar = (props) => {
	const [anchorEl, setAnchorEl] = useState(null);
    const [loggedIn, setLoggedIn] = useState(true);
    const isMenuOpen = Boolean(anchorEl);
    const menuId = 'primary-search-account-menu';

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const loggedInDiv =  (
        <div>
            <Search>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
             
                />
            </Search>
            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
                <MailIcon />
            </Badge>
            </IconButton>
            <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
            >
            <Badge badgeContent={17} color="error">
                <NotificationsIcon />
            </Badge>
            </IconButton>
            <IconButton
            size="large"
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
    )

    const notLoggedInDiv = (
        <div>
            <Link style={{textDecoration: "none"}} to={"/login"}>
                <Button variant="contained" sx={{ backgroundColor: "#344767", height: 70, width:240, borderRadius: "28px", fontSize: "30px", textDecoration: "none" }}>Login</Button>
            </Link>
        </div>

    )    

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
        >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    return (
        <NavDiv className="navbar" sx={{ backgroundColor: alpha("#FFFFFF", 0.15) }}>
            <Toolbar sx={{ columnGap: '25rem', justifyContent: "space-evenly" }}>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                    fontSize= "50px" 
                    fontWeight={"bold"}
                >
                   <Link to={"/"} style={{textDecoration: "none", color: "inherit"}}>
                        Moviemanor  
                   </Link> 
                </Typography>
                {loggedIn ? loggedInDiv : notLoggedInDiv}
            </Toolbar>
            {renderMenu}
        </NavDiv>
    );
}

export default NavBar;