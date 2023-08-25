

import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../store/app-context';
import axios from 'axios';

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

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(currentUser);

    const logoutHandler = async () => {
        if (confirm('Logging out?')) {
            await axios.post('/api/v1/users/logout');
            appContext.setCurrentUser(null);
            localStorage.removeItem('currentUser');
            appContext.setAlert({
                message: `Goodbye!`,
                variant: 'success',
            });
            navigate('/');
        }
    };

    // for testing only
    const quickLoginHandler = async () => {
        axios
            .post(
                '/api/v1/users/login',
                {
                    username: 'brian',
                    password: 'brian',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then(res => {
                axios.get('/api/v1/auth/currentuser').then(resp => {
                    appContext.setAlert({
                        message: `Welcome back, ${resp.data.username}!`,
                        variant: 'success',
                    });
                    appContext.setCurrentUser(resp.data);
                    localStorage.setItem('currentUser', JSON.stringify(resp.data));
                    // navigate(-1); // back to previous page
                    // navigate('/');
                });
            });
    };

    return (
        <BootstrapNavbar variant="dark" className="bg-primary-dark-color">
            <Container>
                <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                <Nav className="me-auto">
                    {pages.map(page => (
                        <Link to={page.href} style={{ textDecoration: 'none' }} key={page.title}>
                            <span className="nav-link">{page.title}</span>
                        </Link>
                    ))}
                </Nav>
                
                {/* testing */}
                <Link to="/testing">Testing</Link>
                <button onClick={quickLoginHandler}>Quick login</button>

                <Nav activeKey="/home">
                    {currentUser ? (
                        <NavDropdown
                            title={currentUser?.username}
                            id="nav-dropdown"
                            className="pe-2"
                        >
                            <Link
                                to={`/users/${currentUser.username}`}
                                key={'user'}
                                className="dropdown-item"
                            >
                                <span>View</span>
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
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
