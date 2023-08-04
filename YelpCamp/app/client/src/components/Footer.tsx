import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import AppContext from '../store/app-context';

const Footer: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const debuggingMode = true;

    const handler = () => {
        console.log(appContext);
    };


    return (
        <footer className="footer bg-dark py-3 mt-auto">
            <Container>
                <span className="text-muted">YelpCamp &copy; Hoang Nguyen 2023</span>
                {debuggingMode && (
                    <div>
                        <button onClick={handler}>Log current context</button>
                    </div>
                )}
            </Container>
        </footer>
    );
};

export default Footer;
