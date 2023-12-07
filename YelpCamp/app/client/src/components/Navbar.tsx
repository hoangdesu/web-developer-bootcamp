import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar as BootstrapNavbar, Button, NavDropdown, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../store/app-context';
import ModalLogout from './Modals/ModalLogout';
import Logo from '../assets/logo-white.png';

import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
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
    const { width: windowWidth } = useWindowDimensions();
    const [showSearchBox, setShowSearchBox] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

    const logoutHandler = async () => {
        appContext.setModal({ open: true, content: <ModalLogout /> });
    };

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

                <div className="flex flex-row items-end md:items-center gap-[1.2em] md:gap-[2em] text-[#9B9C9D]">
                    {/* Display searchbox inline for desktop */}
                    {windowWidth >= 768 ? (
                        <div className="w-[262px]">
                            <SearchBoxAnimatedCarret showSearchBox={showSearchBox} />
                        </div>
                    ) : (
                        <SearchIcon
                            onClick={() => setShowSearchBox(!showSearchBox)}
                            aria-controls="collapse-searchbox"
                            aria-expanded={showSearchBox}
                            fontSize="medium"
                            className={` ${
                                showSearchBox ? 'text-[#C9CCCD]' : 'text-[#9B9C9D]'
                            } hover:text-[#C9CCCD] hover:cursor-pointer `}
                            style={{ transition: 'all 0.2s ease' }}
                        />
                    )}

                    {currentUser ? (
                        <NavDropdown
                            title={<AccountCircleIcon fontSize="medium" />}
                            id="nav-dropdown"
                            align={windowWidth >= 992 ? { lg: 'end' } : { lg: 'start' }}
                            className="hover:text-[#C9CCCD]"
                        >
                            <Link
                                to={`/users/${currentUser.username}?tab=info`}
                                key={'user'}
                                className="dropdown-item active:bg-gray-300 active:text-primary-dark-color"
                            >
                                <div className="font-medium">{currentUser?.username}</div>
                                <div className="text-muted text-sm">View your account</div>
                            </Link>
                            <Link
                                to={'/campgrounds/new'}
                                key={'new'}
                                className="dropdown-item active:bg-gray-300 active:text-primary-dark-color"
                            >
                                Add new campground
                            </Link>
                            <NavDropdown.Divider />
                            <Button
                                variant="secondary"
                                onClick={logoutHandler}
                                className="dropdown-item active:bg-gray-300 active:text-primary-dark-color flex flex-row items-center gap-1"
                            >
                                <LogoutIcon /> <span>Log out</span>
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

            {windowWidth < 768 && (
                <Collapse in={showSearchBox}>
                    <div id="collapse-searchbox" className="w-full">
                        <Container className="px-[5%] py-2">
                            <div className="">
                                <SearchBoxAnimatedCarret showSearchBox={showSearchBox} />
                            </div>
                        </Container>
                    </div>
                </Collapse>
            )}
        </BootstrapNavbar>
    );
};

export default Navbar;
