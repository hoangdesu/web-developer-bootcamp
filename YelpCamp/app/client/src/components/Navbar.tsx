import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Navbar as BootstrapNavbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const pages = [
    {
        title: 'Campgrounds',
        href: '/',
    },
    {
        title: 'New campground',
        href: '/campgrounds/new',
    },
    {
        title: 'About',
        href: '/about',
    },
];

const Navbar: React.FunctionComponent = () => {
    return (
        <BootstrapNavbar bg="dark" variant="dark">
            <Container>
                <BootstrapNavbar.Brand href="/">YelpCamp</BootstrapNavbar.Brand>
                <Nav className="me-auto">
                    {pages.map(page => (
                        <Link to={page.href} style={{ textDecoration: 'none' }} key={page.title}>
                            <Nav.Link href={page.href}>{page.title}</Nav.Link>
                        </Link>
                    ))}
                </Nav>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar;
