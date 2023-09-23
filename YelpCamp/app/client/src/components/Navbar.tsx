import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar as BootstrapNavbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../store/app-context';
import axios from 'axios';
import ModalLogout from './Modals/ModalLogout';

const pages = [
    {
        title: 'Campgrounds',
        href: '/',
    },
    {
        title: 'New Campground',
        href: '/campgrounds/new',
    },
    {
        title: 'About',
        href: '/about',
    },
];

const Navbar: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);

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
        <div>
            <BootstrapNavbar expand="md" variant="dark" className="bg-primary-dark-color">
                <Container className="px-[5%]">
                    <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {pages.map(page => (
                                <Link
                                    to={page.href}
                                    style={{ textDecoration: 'none' }}
                                    key={page.title}
                                >
                                    <span className="nav-link">{page.title}</span>
                                </Link>
                            ))}
                        </Nav>
                        <Nav activeKey="/home">
                            {/* testing */}
                            {/* <Link to="/testing">Testing</Link>
                            <button onClick={quickLoginHandler}>Quick login</button> */}

                            {/* TODO: nice to have: different burger animation */}
                            {currentUser ? (
                                <NavDropdown
                                    title={currentUser?.username}
                                    id="nav-dropdown"
                                    className="pe-2"
                                >
                                    <Link
                                        to={`/user/${currentUser.username}?tab=info`}
                                        key={'user'}
                                        className="dropdown-item active:bg-primary-dark-color" // TODO: change this color
                                    >
                                        <span className="">View</span>
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
        </div>
    );
};

export default Navbar;
