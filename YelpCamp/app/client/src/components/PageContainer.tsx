import React, { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode
}

const PageContainer: React.FunctionComponent<PageContainerProps> = ({ children }) => {
    // return <div className="d-flex flex-column vh-100">{children}</div>;
    return <div>{children}</div>
};

export default PageContainer;
