import React, { useContext, useState } from 'react';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import AppContext from '../../store/app-context';

const ModalShare = () => {
    const appContext = useContext(AppContext);

    async function copyToClipboard(textToCopy: String) {
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
            appContext.setModal({ open: false, content: null });
            appContext.setSnackbar(
                true,
                'Campground link has been copied to your clipboard',
                'success',
            );
        } catch (error) {
            console.error(error);
            appContext.setSnackbar(true, 'Error: cannot copy to clipboard', 'error');
        }
    };

    return (
        <div>
            <h2>Share this campground</h2>
            <PrimaryBlackButton onClick={copyText}>Copy campground link</PrimaryBlackButton>
        </div>
    );
};

export default ModalShare;
