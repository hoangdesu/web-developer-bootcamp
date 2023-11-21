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
        <footer className="footer bg-dark fixed bottom-0 w-full z-[-1] h-[200px] py-5">
            <Container className="px-[5%]">
                <p className="text-gray-400">YelpCamp &copy; Hoang Nguyen 2023</p>
                <p className="text-gray-400">Build: {__BUILD_TIMESTAMP__}</p>
                {debuggingMode && (
                    <div>
                        <button onClick={handler}>Log current context</button>
                    </div>
                )}
                {/* // TODO: put notes about this project in about section */}
                <div>
                    <Link to="/about" className="text-lg">
                        About
                    </Link>
                </div>
            </Container>
            {/* // TODO: add social links eg facebook X github ig ... */}
            {/* button back to top */}
        </footer>
    );
};

export default Footer;
