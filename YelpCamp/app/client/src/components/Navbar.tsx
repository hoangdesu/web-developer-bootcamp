import React, { useContext, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import {
    Navbar as BootstrapNavbar,
    Nav,
    Button,
    NavDropdown,
    Form,
    Dropdown,
    DropdownButton,
    Collapse,
    Fade,
} from 'react-bootstrap';
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
import useWindowDimensions from '../hooks/useWindowDimensions';
import SearchBoxAnimatedCarret from './SearchBoxAnimatedCarret';

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
    const { width: windowWidth } = useWindowDimensions();
    const [showSearchBox, setShowSearchBox] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const onSearchSubmit = (evt: React.FormEvent) => {
        evt.preventDefault();
        if (!search) return;

        navigate(`/search?q=${search}`);
    };

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });
    };

    const v1 = (
        <>
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
                    {/* <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search YelpCamp"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={e => setSearch(e.currentTarget.value)}
                        />
                    </Search> */}
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
        </>
    );

    // return (
    //     <BootstrapNavbar expand="md" variant="dark" className="bg-primary-dark-color">
    //     <Container className='px-[5%]'>
    //     {v1}
    //     </Container>
    //     </BootstrapNavbar>
    // )

    return (
        <BootstrapNavbar expand="md" variant="dark" className="bg-primary-dark-color">
            <Container className="px-[5%] py-1">
                <LogoSection>
                    <Link to={'/'} className="no-underline">
                        <span className="nav-link flex flex-row justify-center items-center gap-2">
                            <img src={Logo} alt="YelpCamp logo" width={'35px'} />
                            <span className="navbar-brand hover-underline-animation">YelpCamp</span>
                        </span>
                    </Link>
                </LogoSection>

                <div className="flex flex-row items-center gap-[2em] text-[#9B9C9D]">
                    {/* Display searchbox inline for desktop */}
                    {windowWidth >= 768 ? (
                        <div className="w-[262px]">
                            <SearchBoxAnimatedCarret />
                        </div>
                    ) : (
                        // <button
                        //     onClick={e => setShowSearchBox(!showSearchBox)}
                        //     aria-controls="example-collapse-text"
                        //     aria-expanded={showSearchBox}
                        // >
                        //     search
                        // </button>
                        <></>
                    )}

                    {currentUser ? (
                        <NavDropdown
                            title={<AccountCircleIcon fontSize="medium" />}
                            id="nav-dropdown"
                            align={windowWidth >= 992 ? { lg: 'end' } : { lg: 'start' }}
                            className="hover:text-[#C9CCCD]"
                        >
                            <NavDropdown.Item className="dropdown-item active:bg-gray-200 active:text-primary-dark-color">
                                <div>
                                    <div>{currentUser?.username}</div>
                                    <div>View your account</div>
                                </div>
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
                    ) : (
                        <div className="flex flex-row gap-3">
                            <Link
                                to={'/login'}
                                key={'login'}
                                style={{ textDecoration: 'none' }}
                                className="nav-link hover:text-[#C9CCCD]"
                            >
                                Login
                            </Link>
                            <Link
                                to={'/register'}
                                key={'register'}
                                style={{ textDecoration: 'none' }}
                                className="nav-link hover:text-[#C9CCCD]"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </Container>

            {/* <div>
                <button
                    onClick={() => setShowSearchBox(!showSearchBox)}
                    aria-controls="example-collapse-text"
                    aria-expanded={showSearchBox}
                >
                    click
                </button>
                <Collapse in={showSearchBox}>
                    <div id="example-collapse-text">
                        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
                        richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes
                        anderson cred nesciunt sapiente ea proident.
                    </div>
                </Collapse>
            </div> */}

            {windowWidth < 768 && showSearchBox && (
                // <Container className="px-[5%] py-2">
                //     <div className="w-full">
                //         <SearchBoxAnimatedCarret />
                //     </div>
                // </Container>
                <Collapse in={true}>
                    <Container className="px-[5%] py-2">
                        <div className="w-full" id="example-collapse-text">
                            <SearchBoxAnimatedCarret />
                        </div>
                    </Container>
                </Collapse>
            )}

            {/* <Drawer anchor={'right'} open={drawerOpen} onClose={closeDrawer(false)}>

                {list()}
            </Drawer> */}
        </BootstrapNavbar>
    );
};

export default Navbar;
