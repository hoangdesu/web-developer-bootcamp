import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import AppContext from '../store/app-context';
import { Link } from 'react-router-dom';

const Footer: React.FunctionComponent = () => {
    const appContext = useContext(AppContext);
    const debuggingMode = false; // TODO: remove in production

    const handler = () => {
        console.log(appContext);
    };

    return (
        <footer className="footer bg-dark fixed bottom-0 w-full z-[-1] h-[150px] py-5">
            <Container className="px-[5%]">
                <span className="text-muted">YelpCamp &copy; Hoang Nguyen 2023</span>
                {debuggingMode && (
                    <div>
                        <button onClick={handler}>Log current context</button>
                    </div>
                )}
                {/* // TODO: move about section down here */}
                <div>
                    <Link to="/about" className="text-lg">
                        About 
                    </Link>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
