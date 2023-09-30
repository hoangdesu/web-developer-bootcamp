import React, { useContext, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar as BootstrapNavbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../store/app-context';
import ModalLogout from './Modals/ModalLogout';
import Logo from '../assets/logo-white.png';

import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddIcon from '@mui/icons-material/Add';

const Search = styled('div')(({ theme }) => ({
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
        [theme.breakpoints.up('sm')]: {
            width: '12rem',
            '&:focus, &:hover': {
                width: '15rem',
            },
        },
    },
}));

const Navbar: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!search) return;

        navigate(`/search?q=${search}`);
    };

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });
        // if (confirm('Logging out?')) {
        //     await axios.post('/api/v1/users/logout');
        //     appContext.setCurrentUser(null);
        //     localStorage.removeItem('currentUser');
        //     appContext.setAlert({
        //         message: `Goodbye!`,
        //         variant: 'success',
        //     });
        //     navigate('/');
        // }
    };

    return (
        <BootstrapNavbar expand="md" variant="dark" className="bg-primary-dark-color">
            <Container className="px-[5%]">
                <Link to={'/'} className="no-underline">
                    <span className="nav-link flex flex-row justify-center items-center gap-2">
                        <img src={Logo} alt="YelpCamp logo" width={'36px'} />
                        <span className="navbar-brand">YelpCamp</span>
                    </span>
                </Link>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav" className="">
                    {/* TODO: align this mtfk center of navbar */}
                    <form action="" onSubmit={onSearchSubmit} className="me-auto">
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search campgrounds..."
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={e => setSearch(e.currentTarget.value)}
                            />
                        </Search>
                    </form>
                    <Nav activeKey="/" className="">
                        {currentUser ? (
                            <NavDropdown
                                title={currentUser?.username}
                                id="nav-dropdown"
                                className="pe-2"
                                align={{ lg: 'end' }}
                            >
                                <Link
                                    to={'/campgrounds/new'}
                                    key={'user'}
                                    className="dropdown-item active:bg-primary-accent-color"
                                >
                                    <span className="">New campground</span>
                                </Link>
                                <Link
                                    to={`/user/${currentUser.username}?tab=info`}
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
                                    Logout
                                </Button>
                            </NavDropdown>
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
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
