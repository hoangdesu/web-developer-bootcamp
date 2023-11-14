import React from 'react';
import { Link } from 'react-router-dom';
import { Reservation } from '../../types';
import { formatDateWithoutTime } from '../../helpers/campground';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface TabProps {
    reservations: Reservation[];
}

interface ReservationCardProps {
    resv: Reservation;
    index: number;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ resv, index }) => {
    return (
        <div className="bg-white rounded border w-full md:max-w-[700px] flex flex-col md:flex-row gap-2 overflow-hidden">
            <img
                src={resv.campground.images[0].url}
                alt="Campground thumbnail"
                className="w-full h-[200px] md:h-auto md:max-h-[220px] md:max-w-[250px] object-cover"
            />
            <div className="text-sm flex flex-col p-2">
                <div className="mb-2">
                    <h5 className="font-normal mb-1">
                        {index + 1}. {resv.campground.title}
                    </h5>
                    <span className="text-muted">{resv.campground.location}</span>
                </div>
                <span>
                    Check in:{' '}
                    <span className="font-medium">
                        {formatDateWithoutTime(resv.checkIn, 'full')}
                    </span>
                </span>{' '}
                <span>
                    Check out:{' '}
                    <span className="font-medium">
                        {formatDateWithoutTime(resv.checkOut, 'full')}
                    </span>
                </span>
                <span>
                    Night: <span className="font-medium">{resv.nights}</span>
                </span>
                <span>
                    Guests: <span className="font-medium">{resv.guests}</span>
                </span>
                <span>
                    Discount:{' '}
                    <span className="font-medium">
                        {resv.discount.code
                            ? `${resv.discount.percentage}% (${resv.discount.code})`
                            : 'Not applied'}
                    </span>
                </span>
                <span>
                    Total amount:{' '}
                    <span className="font-medium">${resv.totalAmount.toFixed(2)}</span>
                </span>
                <span>
                    Status:{' '}
                    <span className="font-medium">
                        {resv.status}{' '}
                        {resv.status === 'PENDING' && (
                            <Link
                                to={`/reservations/${resv._id}/checkout`}
                                className="inline-flex items-center justify-center text-green-600 hover:text-green-800 ml-2 duration-300 no-underline hover:underline"
                            >
                                PAY NOW! <ArrowForwardIcon fontSize="small" />
                            </Link>
                        )}
                    </span>
                </span>
            </div>
        </div>
    );
};

const UserReservationsTab: React.FC<TabProps> = ({ reservations }) => {
    console.log(reservations);

    return (
        <div>
            <h1 className="mb-4">Reservations</h1>
            <div className="flex flex-col gap-3">
                {reservations.length > 0 ? (
                    reservations.map((resv, index) => (
                        <ReservationCard key={resv._id} resv={resv} index={index} />
                    ))
                ) : (
                    <div>Empty reservations</div>
                )}
            </div>
        </div>
    );
};

export default UserReservationsTab;
