import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import axios from '../../config/yelpcampAxios';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';
import { Review } from '../../types';

interface ModalProps {
    review: Review;
    formData: {
        comment: string;
        rating: number;
    };
    refetch: () => {};
    isEditingReview: boolean;
    setIsEditingReview: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalSaveReviewChange: React.FC<ModalProps> = ({
    review,
    formData,
    refetch,
    isEditingReview,
    setIsEditingReview,
}) => {
    const appContext = useContext(AppContext);

    // TODO: work on this mtfk
    const saveReviewHandler = () => {
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
                        Authorization: appContext.currentUser!.id.toString(),
                    },
                },
            )
            .then(res => {
                setIsEditingReview(!isEditingReview);
                appContext.setModal({ open: false, content: null });
                appContext.setSnackbar(true, 'Your review has been updated.', 'success');
                refetch();
            })
            .catch(err => {
                appContext.setSnackbar(true, 'Error: your review was not saved', 'error');
                setIsEditingReview(!isEditingReview);
            });
    };
    return (
        <div>
            <h2>Save review?</h2>
            <div className="flex flex-row gap-2 items-center justify-between">
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                >
                    Cancel
                </SecondaryTransparentButton>
                <PrimaryBlackButton onClick={saveReviewHandler} className="w-full">
                    Yes
                </PrimaryBlackButton>
            </div>
        </div>
    );
};

export default ModalSaveReviewChange;
