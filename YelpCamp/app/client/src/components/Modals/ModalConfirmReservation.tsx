import styled from '@emotion/styled';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/yelpcampAxios';
import AppContext from '../../store/app-context';
import { Campground, Reservation } from '../../types';
import PrimaryBlackButton from '../Buttons/PrimaryBlackButton';
import SecondaryTransparentButton from '../Buttons/SecondaryTransparentButton';

interface ModalProps {
    reservation: Reservation;
    campground: Campground;
}

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;

    td {
        vertical-align: top;
    }
`;

const ModalConfirmReservation: React.FC<ModalProps> = ({ reservation, campground }) => {
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
            data: reservation.discount.code
                ? `${reservation.discount.code} (${reservation.discount.percentage}%)`
                : '-',
        },
    ];

    const makeReservation = () => {
        axios.post('/api/v1/reservations', { reservation }).then(res => {
            navigate(`/reservations/${res.data._id}/checkout`);
        });
    };

    return (
        <div>
            <h2 className="mb-3">Confirm reservation</h2>
            <Table className="w-full border-separate">
                <tbody>
                    {TABLE_FIELDS.map(({ title, data }) => (
                        <tr key={title}>
                            <td>{title}</td>
                            <td>
                                <span
                                    className={`font-medium ${
                                        title === 'Discount code' &&
                                        reservation.discount.percentage > 0 &&
                                        'text-red-500'
                                    }`}
                                >
                                    {data}
                                </span>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td>Total amount</td>
                        <td className="font-bold text-lg">
                            ${Number(reservation.totalAmount).toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className="w-full flex flex-row gap-2 mt-3">
                <SecondaryTransparentButton
                    onClick={() => appContext.setModal({ open: false, content: null })}
                    className="grow-0"
                >
                    Cancel
                </SecondaryTransparentButton>
                <PrimaryBlackButton onClick={makeReservation} className="grow">
                    Checkout <ArrowForwardIcon />
                </PrimaryBlackButton>
            </div>
        </div>
    );
};

export default ModalConfirmReservation;
