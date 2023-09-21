import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import { Navbar as BootstrapNavbar, Nav, Button, NavDropdown } from 'react-bootstrap';
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

    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
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

    const original = (
        <>
            <BootstrapNavbar variant="dark" className="bg-primary-dark-color ">
                <Container>
                    <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                    <BootstrapNavbar.Collapse id="basic-navbar-nav">
                        <Nav>
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
                                            to={`/user/${currentUser.username}`}
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
                        </Nav>
                    </BootstrapNavbar.Collapse>
                </Container>
            </BootstrapNavbar>
        </>
    );

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
                                        to={`/user/${currentUser.username}`}
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
