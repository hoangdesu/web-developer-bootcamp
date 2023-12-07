import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/yelpcampAxios';
import AppContext from '../../store/app-context';
import { Review } from '../../types';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';

interface ModalProps {
    review: Review;
    refetch: () => {};
}

const ModalDeleteReview: React.FC<ModalProps> = ({ review, refetch }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const deleteReviewHandler = () => {
        axios
            .delete(`/api/v1/campgrounds/${review.campground}/reviews/${review._id}`, {
                headers: {
                    Authorization: appContext.currentUser!.id.toString(),
                },
            })
            .then(res => {
                appContext.setModal({ open: false, content: null });
                appContext.setSnackbar(true, 'Your review has been deleted', 'success');
                refetch();
            })
            .catch(e => {
                appContext.setModal({ open: false, content: null });
                appContext.setSnackbar(true, 'Delete review error', 'error');
            });
    };
    return (
        <div>
            <h1>Delete your review?</h1>
            <div className="flex flex-row gap-2">
                <PrimaryBlackButton onClick={deleteReviewHandler}>Delete</PrimaryBlackButton>
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                >
                    Cancel
                </SecondaryTransparentButton>
            </div>
        </div>
    );
};

export default ModalDeleteReview;
