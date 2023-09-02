import React, { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    // vh-100
    // return <div className="flex flex-column justify-center w-[100vw] bg-primary-color">{children}</div>;
    // return <div className="flex flex-column justify-center w-[100vw] h-[100%] bg-primary-color">{children}</div>;
    // return <div className="flex flex-column justify-center bg-primary-color">{children}</div>;

    return <div className="d-flex flex-column vh-100 bg-primary-color">{children}</div>; // working version

    // w-screen h-screen
    // setting h-screen will push nav and footer elements out of screen?
};

export default PageContainer;
