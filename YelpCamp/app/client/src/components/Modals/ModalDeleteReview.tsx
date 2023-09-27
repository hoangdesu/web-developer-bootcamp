import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Review } from '../../types';

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
        // TODO: STYLE this mtfk
        <div>
            <h1>Delete Review?</h1>
            <button onClick={deleteReviewHandler}>Yes</button>
        </div>
    );
};

export default ModalDeleteReview;
