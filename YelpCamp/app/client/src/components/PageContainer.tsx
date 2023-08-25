import React, { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    // vh-100
    // return <div className="flex flex-column justify-center w-[100vw] bg-primary-color">{children}</div>;
    return <div className="flex flex-column justify-center  bg-primary-color">{children}</div>;

    // w-screen h-screen
};

export default PageContainer;
