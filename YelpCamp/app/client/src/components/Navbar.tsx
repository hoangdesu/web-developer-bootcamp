import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../store/app-context';

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
        title: 'Register',
        href: '/register',
    },
    {
        title: 'Login',
        href: '/login',
    },
    {
        title: 'About',
        href: '/about',
    },
];

const Navbar: React.FunctionComponent = () => {
    const appContext = useContext(AppContext)

    return (
        <BootstrapNavbar bg="dark" variant="dark">
            <Container>
                <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                {/* <Nav className="me-auto"> */}
                <Nav>
                    {pages.map(page => (
                        <Link to={page.href} style={{ textDecoration: 'none' }} key={page.title}>
                            <span className="nav-link">{page.title}</span>
                        </Link>
                    ))}
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
