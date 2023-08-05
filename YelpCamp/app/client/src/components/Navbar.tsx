import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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

    const logoutHandler = async () => {
        if (confirm('Logging out?')) {
            await axios.post('/api/v1/users/logout');
            appContext.setCurrentUser(null);
            localStorage.removeItem('currentUser');
        }
    };

    return (
        <BootstrapNavbar bg="dark" variant="dark">
            <Container>
                <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                <Nav className="me-auto">
                    {/* <Nav> */}
                    {pages.map(page => (
                        <Link to={page.href} style={{ textDecoration: 'none' }} key={page.title}>
                            <span className="nav-link">{page.title}</span>
                        </Link>
                    ))}

                    {appContext.currentUser ? (
                        <Button variant="secondary" onClick={logoutHandler}>
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Link to={'/login'} style={{ textDecoration: 'none' }} key={'login'}>
                                <span className="nav-link">Login</span>
                            </Link>
                            <Link to={'/register'} style={{ textDecoration: 'none' }} key={'register'}>
                                <span className="nav-link">Register</span>
                            </Link>
                        </>
                    )}
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
