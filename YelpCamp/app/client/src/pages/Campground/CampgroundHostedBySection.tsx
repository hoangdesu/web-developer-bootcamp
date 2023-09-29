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

const EditButton = styled.button`
    border: 1px solid black;
    background-color: transparent;
    padding: 4px 20px;
    font-size: 14px;
    height: fit-content;
    transition: 100ms ease;
    &:hover {
        color: var(--primary-color);
        background-color: var(--primary-dark-color);
        cursor: pointer;
    }
`;

const CampgroundHostedBySection: React.FC<SectionProps> = ({ campground }) => {
    const navigate = useNavigate();
    const appContext = useContext(AppContext);

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
                        to={`/user/${campground.author?.username}`}
                        className="text-primary-dark-color"
                    >
                        {campground.author?.username || 'annonymous'}
                    </Link>
                </h4>

                {/* show buttons to edit and delete campground for author */}
                {isAuthor(appContext, campground) && (
                    <div className="flex gap-2">
                        <EditButton onClick={() => navigate(`/campgrounds/${campground._id}/edit`)}>
                            Edit
                        </EditButton>
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
