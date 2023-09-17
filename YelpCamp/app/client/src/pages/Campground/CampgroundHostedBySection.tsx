import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate, isAuthor, timeDifference } from '../../helpers/campground';
import axios from 'axios';
import AppContext from '../../store/app-context';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { Campground } from '../../types';
import styled from '@emotion/styled';

interface SectionProps {
    campground: Campground;
}

const CampgroundHostedBySection: React.FC<SectionProps> = ({ campground }) => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const deleteCampgroundHandler = () => {
        // TODO: replace with Modal
        if (confirm(`Delete ${campground.title}?`)) {
            axios
                .delete(`/api/v1/campgrounds/${campgroundId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: appContext.currentUser.id.toString(),
                    },
                })
                .then(() => {
                    appContext.setAlert({
                        message: 'Deleted campground successfully',
                        variant: 'warning',
                    });
                    navigate('/');
                })
                .catch(err => {
                    // TODO: write a error handling function for navigating
                    console.error(err);
                    let message = '';
                    if (err.response.status === 401) {
                        message = 'Unauthorized to delete campground. Please log in again.';
                        appContext.setAlert({
                            message,
                            variant: 'danger',
                        });
                        navigate('/login');
                    } else if (err.response.status === 403) {
                        message = 'Unauthorized to delete campground';
                    } else {
                        message = `${err.response.status} - ${err.response.data}`;
                    }
                    appContext.setAlert({
                        message,
                        variant: 'danger',
                    });
                    // appContext.setCurrentUser(null);
                });
        }
    };
    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h5">Created at</Popover.Header>
            <Popover.Body>{formatDate(campground.createdAt)}</Popover.Body>
        </Popover>
    );
    return (
        <div>
            <div className="flex flex-row justify-between">
                <h4 className="font-normal">
                    Campground hosted by{' '}
                    <Link
                        to={`/users/${campground.author?.username}`}
                        className="text-primary-dark-color"
                    >
                        {campground.author?.username || 'annonymous'}
                    </Link>
                </h4>

                {/* show buttons to edit and delete campground for author */}
                {isAuthor(appContext, campground) && (
                    <div className="flex gap-2">
                        {/* <StyledLink to={`/campgrounds/${campground._id}/edit`}>Edit</StyledLink> */}
                        <button
                            className="
                        bg-emerald-700
                        text-primary-color 
                        transition 
                        ease-in-out
                        outline-0 
                        px-3
                        py-1
                        border-0
                        rounded
                        m-0
                        "
                            onClick={() => navigate(`/campgrounds/${campground._id}/edit`)}
                        >
                            Edit
                        </button>
                        <button
                            className="
                                bg-red-700
                                text-primary-color 
                                transition 
                                ease-in-out
                                outline-0 
                                px-3
                                py-1
                                border-0
                                rounded
                                m-0
                                "
                            onClick={deleteCampgroundHandler}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <OverlayTrigger placement="top" overlay={popover}>
                <span className="text-muted">
                    Created {timeDifference(Date.now(), Date.parse(campground.createdAt))}
                </span>
            </OverlayTrigger>
        </div>
    );
};

export default CampgroundHostedBySection;
