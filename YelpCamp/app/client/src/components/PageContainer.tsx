import React, { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    return <div className="d-flex flex-column min-h-screen bg-primary-color">{children}</div>;
};

export default PageContainer;
