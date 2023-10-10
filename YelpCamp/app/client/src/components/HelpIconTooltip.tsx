import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HelpIcon from '@mui/icons-material/Help';

const HelpIconTooltip = ({ title }) => {
    const [helpIcon, setHelpIcon] = useState<'outline' | 'fill'>('outline');

    return (
        <Tooltip title={title} placement="left" arrow>
            <span
                onMouseEnter={() => setHelpIcon('fill')}
                onMouseLeave={() => setHelpIcon('outline')}
            >
                {helpIcon === 'outline' && <HelpOutlineIcon fontSize="small" />}
                {helpIcon === 'fill' && <HelpIcon fontSize="small" />}
            </span>
        </Tooltip>
    );
};

export default HelpIconTooltip;
