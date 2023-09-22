import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import FlashAlert from './FlashAlert';
import PageModal from '../components/Modals/PageModal';
import Footer from './Footer';
import { Snackbar } from '@mui/material';

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    return (
        <div className="d-flex flex-column min-h-screen bg-primary-color">
            <Navbar />
            <Container className="my-5 px-[5%]">
                <FlashAlert />
                {children}
                <PageModal />
                {/* <Snackbar /> */}
            </Container>
            <Footer />
        </div>
    );
};

export default PageContainer;
