import React from 'react';
import { Link } from 'react-router-dom';

const UserReservationsTab = ({ reservations }) => {
    return (
        <div>
            <h1>Reservations</h1>
            <ol>
                {reservations &&
                    reservations.map(resv => {
                        return (
                            <li key={resv._id}>
                                <div>
                                    <p>Bookedby: {resv.bookedBy}</p>
                                    <p>Campground: {resv.campground}</p>
                                    <p>Checkin: {resv.checkIn}</p>
                                    <p>checkOut: {resv.checkOut}</p>
                                    <p>
                                        Nights: {resv.nights} - guests: {resv.guests}
                                    </p>
                                    <p>
                                        totalPrice: {resv.totalPrice} - status: {resv.status}
                                    </p>
                                </div>
                                <div>
                                    <Link to={`/reservations/${resv._id}`}>{resv._id}</Link>
                                </div>
                            </li>
                        );
                    })}
            </ol>
        </div>
    );
};

export default UserReservationsTab;
