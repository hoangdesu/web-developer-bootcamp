import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/yelpcampAxios';

const ModalSaveReviewChange = ({
    review,
    formData,
    refetch,
    isEditingReview,
    setIsEditingReview,
}) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    // TODO: work on this mtfk
    const btnonclick = () => {
        axios
            .put(
                `/api/v1/campgrounds/${review.campground}/reviews/${review._id}`,
                {
                    review: {
                        comment: formData.comment,
                        rating: formData.rating,
                    },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: appContext.currentUser.id.toString(),
                    },
                },
            )
            .then(res => {
                setIsEditingReview(!isEditingReview);
                appContext.setModal({ open: false, content: null });
                appContext.setSnackbar(true, 'SAVED', 'success');
                refetch();
            })
            .catch(err => {
                console.log('error', err);
                if (err.response.status === 401) {
                    appContext.setAlert({
                        message: 'Please login again!',
                        variant: 'info',
                    });
                    localStorage.removeItem('currentUser');
                    navigate('/login');
                } else {
                    appContext.setAlert({
                        message: 'Something went wrong. Your review was not saved',
                        variant: 'danger',
                    });
                    setIsEditingReview(!isEditingReview);
                    // appContext.setModal({ open: false, content: null });
                    // appContext.setSnackbar(true, 'Delete review error', 'error');
                }
            });
    };
    return (
        // TODO: STYLE this mtfk
        <div>
            <h1>Save review?</h1>
            <button onClick={btnonclick}>Yes</button>
        </div>
    );
};

export default ModalSaveReviewChange;
