import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../../types';

const ReservationCard = styled.div``;

interface TabProps {
    // todo: modify reservation shape, or extend using TS tools
    reservations: Reservation[];
}

const UserReservationsTab: React.FC<TabProps> = ({ reservations }) => {
    return (
        <div>
            <h1 className="mb-4">Reservations</h1>
            <ol>
                {reservations.length > 0 ? (
                    reservations.map(resv => {
                        return (
                            <li key={resv._id}>
                                <ReservationCard>
                                    <p>Bookedby: {resv.bookedBy.username}</p>
                                    <p>Campground: {resv.campground.title}</p>
                                    <img src={resv.campground.images[0].thumbnail} alt="" />
                                    <p>Checkin: {resv.checkIn}</p>
                                    <p>checkOut: {resv.checkOut}</p>
                                    <p>
                                        Nights: {resv.nights} - guests: {resv.guests}
                                    </p>
                                    <p>
                                        totalPrice: {resv.totalAmount} - status: {resv.status}
                                    </p>
                                </ReservationCard>
                                <div>
                                    <Link to={`/reservations/${resv._id}`}>{resv._id}</Link>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <div>Empty reservations</div>
                )}
            </ol>

            <div className="flex flex-row">
                <div>Image left</div>
                <div>Info right</div>
            </div>
        </div>
    );
};

export default UserReservationsTab;
