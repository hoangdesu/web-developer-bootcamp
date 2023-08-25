import React, { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    return <div className="flex flex-column vh-100 bg-primary-color">{children}</div>;
};

export default PageContainer;
