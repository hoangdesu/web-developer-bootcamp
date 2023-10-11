import React, { useContext, useState } from 'react';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';
import axios from 'axios';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Campground } from '../../types';

interface ModalProps {
    campground: Campground;
}

const ModalConfirmDeleteCampground: React.FC<ModalProps> = ({ campground }) => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteCampgroundHandler = () => {
        setIsDeleting(true);

        axios
            .delete(`/api/v1/campgrounds/${campground._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: appContext.currentUser!.id.toString(),
                },
            })
            .then(() => {
                appContext.setSnackbar(
                    true,
                    'Your campground has successfully been deleted from YelpCamp',
                    'success',
                );
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                appContext.setSnackbar(true, 'Error: Failed to delete your campground', 'error');
                setIsDeleting(false);
            });
    };

    return (
        <div className="mb-0">
            <h3 className="mb-3">Delete campground "{campground.title}"?</h3>
            <p className="text-red-700">Warning: This action cannot be undone!</p>
            <div className="w-full flex flex-row gap-2">
                {isDeleting ? (
                    <PrimaryBlackButton
                        onClick={deleteCampgroundHandler}
                        className="flex flex-row gap-2 items-center"
                        disabled={true}
                    >
                        <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            as="span"
                        />
                        <span>Deleting...</span>
                    </PrimaryBlackButton>
                ) : (
                    <PrimaryBlackButton onClick={deleteCampgroundHandler}>
                        Delete
                    </PrimaryBlackButton>
                )}

                <SecondaryTransparentButton
                    onClick={() =>
                        appContext.setModal({
                            open: false,
                            content: null,
                        })
                    }
                >
                    Cancel
                </SecondaryTransparentButton>
            </div>
        </div>
    );
};

export default ModalConfirmDeleteCampground;
