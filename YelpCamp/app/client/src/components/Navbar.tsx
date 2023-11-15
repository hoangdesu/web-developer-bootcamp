import React, { useContext, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar as BootstrapNavbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../store/app-context';
import ModalLogout from './Modals/ModalLogout';
import Logo from '../assets/logo-white.png';

import { styled as muistyled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

const Search = muistyled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'var(--secondary-color)',
    transition: 'all 0.2s ease',
    '&:hover, &:focus': {
        backgroundColor: 'white',
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
    // margin: '16px',
}));

const SearchIconWrapper = muistyled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = muistyled(InputBase)(({ theme }) => ({
    color: 'inherit',
    fontFamily: 'Lora serif',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12rem',
            '&:focus, &:hover': {
                width: '15rem',
            },
        },
    },
}));

const LogoSection = styled.span`
    .hover-underline-animation {
        display: inline-block;
        position: relative;
    }

    .hover-underline-animation:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 1px;
        bottom: 4px;
        left: 0;
        background-color: var(--primary-color);
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
    }

    .hover-underline-animation:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

const Navbar: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!search) return;

        navigate(`/search?q=${search}`);
    };

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });
    };

    const closeDrawer = open => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const list = () => (
        <Box sx={{ width: 250 }} role="presentation" onClick={closeDrawer} onKeyDown={closeDrawer}>
            <List>
                {[].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <BootstrapNavbar expand="md" variant="dark" className="bg-primary-dark-color">
            <Container className="px-[5%]">
                <LogoSection>
                    <Link to={'/'} className="no-underline">
                        <span className="nav-link flex flex-row justify-center items-center gap-2">
                            <img src={Logo} alt="YelpCamp logo" width={'35px'} />
                            <span className="navbar-brand hover-underline-animation">YelpCamp</span>
                        </span>
                    </Link>
                </LogoSection>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav" className="">
                    {/* TODO: align this mtfk center of navbar */}
                    <form action="" onSubmit={onSearchSubmit} className="ml-auto mr-5">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search YelpCamp"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={e => setSearch(e.currentTarget.value)}
                            />
                        </Search>
                    </form>
                    <Nav activeKey="/">
                        {currentUser ? (
                            <>
                                <NavDropdown
                                    // title={currentUser?.username}
                                    title={<AccountCircleIcon fontSize="medium" />}
                                    id="nav-dropdown"
                                    className="pe-2"
                                    align={{ lg: 'end' }}
                                >
                                    <NavDropdown.Item className="dropdown-item active:bg-primary-accent-color">
                                        {currentUser?.username}
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <Link
                                        to={'/campgrounds/new'}
                                        key={'new'}
                                        className="dropdown-item active:bg-primary-accent-color"
                                    >
                                        <span className="">New campground</span>
                                    </Link>
                                    <Link
                                        to={`/users/${currentUser.username}?tab=info`}
                                        key={'user'}
                                        className="dropdown-item active:bg-primary-accent-color"
                                    >
                                        <span className="">Profile</span>
                                    </Link>
                                    <Button
                                        variant="secondary"
                                        onClick={logoutHandler}
                                        className="dropdown-item"
                                    >
                                        Log out
                                    </Button>
                                </NavDropdown>
                                {/* <Nav>
                                    <p className="text-white ml-auto">
                                        <AccountCircleIcon fontSize="large" />
                                    </p>
                                </Nav> */}
                            </>
                        ) : (
                            <>
                                <Link
                                    to={'/login'}
                                    key={'login'}
                                    style={{ textDecoration: 'none' }}
                                    className="nav-link"
                                >
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to={'/register'}
                                    key={'register'}
                                    style={{ textDecoration: 'none' }}
                                    className="nav-link"
                                >
                                    <span>Register</span>
                                </Link>
                            </>
                        )}
                    </Nav>
                    <button onClick={() => setDrawerOpen(!drawerOpen)}>Open</button>
                </BootstrapNavbar.Collapse>
            </Container>
            <Drawer anchor={'right'} open={drawerOpen} onClose={closeDrawer(false)}>
                {/* <p>inside drawer</p> */}
                {list()}
            </Drawer>
        </BootstrapNavbar>
    );
};

export default Navbar;
