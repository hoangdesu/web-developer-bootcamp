// WORK IN PROGRESS: CONVERT FLASHMESSAGE COMPONENT FROM CLASS TO USING FUNCTION

import React, { useState, useEffect, useContext, ReactElement } from 'react';
import AppContext from '../store/app-context';

const FM: React.FunctionComponent = ({ children, duration, persistOnHover }): ReactElement => {
    const appContext = useContext(AppContext);
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [remaining, setRemaining] = useState<number>(duration);
    const [timer, setTimer] = useState(null);

    const pauseTimer = () => {
        if (persistOnHover) {
            clearTimeout(timer);

            const start = new Date();
            setRemaining(prev => {
                return prev - new Date() - start;
            });
        }
    };

    const resumeTimer = () => {
        window.clearTimeout(this.timer);

        this.start = new Date();
        this.timer = setTimeout(this.hide, this.remaining);
    };

    hide() {
        // clear alert state in context
        this.context.setAlert(null);
        this.setState({ isVisible: false });
    }

    return (
        <div onMouseEnter={pauseTimer} onMouseLeave={resumeTimer}>
            {children}
        </div>
    );
};

export default FM;
