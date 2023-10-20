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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!search) return;

        navigate(`/search?q=${search}`);
    };

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });
    };

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
                                    key={'new'}
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
                                    Log out
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
