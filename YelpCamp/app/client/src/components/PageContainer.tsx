import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { Container } from 'react-bootstrap';
import FlashAlert from './FlashAlert';
import PageModal from '../components/Modals/PageModal';
import Footer from './Footer';
import { Snackbar } from '@mui/material';
import PageSnackbar from './PageSnackbar';

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    // TODO: use useeffect to clear the snackbar's object on every page load -> remove redundancies
    return (
        <div className="d-flex flex-column min-h-screen bg-primary-color">
            <Navbar />
            <FlashAlert />
            <Container className="my-5 px-[5%]">{children}</Container>
            <PageModal />
            <PageSnackbar />
            <Footer />
        </div>
    );
};

export default PageContainer;
