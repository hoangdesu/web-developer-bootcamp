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

    const logoutHandler = async () => {
        if (confirm('Logging out?')) {
            await axios.post('/api/v1/users/logout');
            appContext.setCurrentUser(null);
            navigate(0);
        }
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark">
            <Container>
                <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                <Nav className="me-auto">
                    {pages.map(page => (
                        <Link to={page.href} style={{ textDecoration: 'none' }} key={page.title}>
                            <span className="nav-link">{page.title}</span>
                        </Link>
                    ))}
                </Nav>
                <Nav className="justify-content-end" activeKey="/home">
                    <NavDropdown title={appContext.currentUser?.username || 'User'} id="nav-dropdown">
                        {appContext.currentUser ? (
                            <>
                                <NavDropdown.Item eventKey="4.1">
                                    <p>{appContext.currentUser.username + ''}</p>
                                </NavDropdown.Item>

                                <NavDropdown.Item eventKey="4.1">
                                    <Button variant="secondary" onClick={logoutHandler}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </>
                        ) : (
                            <>
                                <Link to={'/login'} key={'login'} className="dropdown-item">
                                    Login
                                </Link>
                                <Link to={'/register'} key={'register'} className="dropdown-item">
                                    Register
                                </Link>
                            </>
                        )}
                    </NavDropdown>
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
