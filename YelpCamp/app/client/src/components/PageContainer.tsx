import React, { ReactNode, useEffect, useContext } from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import FlashAlert from './FlashAlert';
import PageModal from '../components/Modals/PageModal';
import Footer from './Footer';
import PageSnackbar from './PageSnackbar';
import AppContext from '../store/app-context';

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    const appContext = useContext(AppContext);

    useEffect(() => {
        appContext.setModal({ open: false, content: null });
    }, []);

    return (
        <div className="d-flex flex-column min-h-screen bg-primary-color mb-[380px] md:mb-[175px] z-10">
            <Navbar />
            <Container className="my-[2em] px-[5%]">
                <FlashAlert />
                {children}
            </Container>
            <PageModal />
            <PageSnackbar />
            <Footer />
        </div>
    );
};

export default PageContainer;
