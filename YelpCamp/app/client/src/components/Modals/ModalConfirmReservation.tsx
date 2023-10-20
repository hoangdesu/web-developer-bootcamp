import React, { useContext } from 'react';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/yelpcampAxios';
import { Campground, Reservation } from '../../types';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';
import styled from '@emotion/styled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ModalProps {
    reservation: Reservation;
    campground: Campground;
    discountPercentage: number;
}

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 6px;
`;

const ModalConfirmReservation: React.FC<ModalProps> = ({
    reservation,
    campground,
    discountPercentage,
}) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const TABLE_FIELDS = [
        {
            title: 'Campground',
            data: campground.title,
        },
        {
            title: 'Location',
            data: campground.location,
        },
        {
            title: 'Check-in',
            // data: Date.parse(reservation.checkIn),
            data: new Date(reservation.checkIn).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                weekday: 'long',
            }),
        },
        {
            title: 'Check out',
            data: new Date(reservation.checkOut).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                weekday: 'long',
            }),
        },
        {
            title: 'Total nights',
            data: reservation.nights,
        },
        {
            title: 'Number of guests',
            data: reservation.guests,
        },
        {
            title: 'Discount code',
            data: reservation.discountCode
                ? `${reservation.discountCode} (${discountPercentage}%)`
                : '-',
        },
        {
            title: 'Total amount',
            data: `$${Number(reservation.totalAmount).toFixed(2)}`,
        },
    ];

    const makeReservation = () => {
        axios.post('/api/v1/reservation/new', { reservation }).then(res => {
            navigate(`/reservation/${res.data._id}`);
        });
    };

    return (
        <div>
            <h2 className="mb-3">Confirm reservation</h2>
            <Table className="w-full border-separate">
                {TABLE_FIELDS.map(({ title, data }) => (
                    <tr key={title}>
                        <td>{title}</td>
                        <td>
                            <span
                                className={`font-medium ${
                                    title === 'Discount code' &&
                                    discountPercentage > 0 &&
                                    'text-red-500'
                                }`}
                            >
                                {data}
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>
            <div className="flex flex-row items-center gap-2 mt-3">
                {/* // TODO: button sizes are wrong */}
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                >
                    Cancel
                </SecondaryTransparentButton>
                <PrimaryBlackButton onClick={makeReservation} className="w-full">
                    Checkout <ArrowForwardIcon />
                </PrimaryBlackButton>
            </div>
        </div>
    );
};

export default ModalConfirmReservation;
