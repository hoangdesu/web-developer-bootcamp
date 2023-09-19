import { Button, IconButton, Snackbar } from '@mui/material';
import React, { useState } from 'react';
import { Close } from '@mui/icons-material';

const ModalShare = () => {
    async function copyToClipboard(textToCopy) {
        // Navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            // Use the 'out of viewport hidden text area' trick
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;

            // Move textarea out of the viewport so it's not visible
            textArea.style.position = 'absolute';
            textArea.style.left = '-999999px';

            document.body.prepend(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
            } catch (error) {
                console.error(error);
            } finally {
                textArea.remove();
            }
        }
    }

    const copyText = async () => {
        console.log('location.href', location.href);

        try {
            await copyToClipboard(location.href);
            console.log('Text copied to the clipboard!');
        } catch (error) {
            console.error(error);
        }
    };

    const [open, setOpen] = useState(false);

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <Close fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div className="">
            ModalShare nè
            <button onClick={copyText}>Copy URL</button>
            <button onClick={() => setOpen(true)}>open snack</button>
            {/* https://mui.com/material-ui/react-snackbar/ */}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}
                message="Note archived"
                action={action}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                className="fixed top-0 left-0 right-0"
            />
        </div>
    );
};

export default ModalShare;
