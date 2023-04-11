import React from 'react';
import Container from 'react-bootstrap/Container';

const Footer: React.FunctionComponent = () => {
    return (
        <footer className="footer bg-dark py-3 mt-auto">
            <Container>
                <span className="text-muted">&copy; YelpCamp 2023</span>
            </Container>
        </footer>
    );
};

export default Footer;
