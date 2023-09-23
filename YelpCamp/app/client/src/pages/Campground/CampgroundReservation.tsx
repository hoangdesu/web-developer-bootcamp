import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from '@emotion/styled';
import { Campground } from '../../types';
import { USDtoVND, getDaysBetween, getNextStartDays } from '../../helpers/campground';
import { Form } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import ModalConfirmReservation from '../../components/Modals/ModalConfirmReservation';
import ModalLogin from '../../components/Modals/ModalLogin';

interface CampgroundResvervationProps {
    campground: Campground;
}

const ReserveSection = styled.div`
    border: 1px solid rgb(221, 221, 221);
    border-radius: 8px;
    padding: 24px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
    width: fit-content;
    /* max-width: fit-content; */
    background: white;
    margin-top: 20px;
`;

const InputButton = props => (
    <span
        className="border rounded-full w-7 h-7 relative flex justify-center items-center text-center p-3 hover:bg-secondary-color ease-in duration-100 hover:cursor-pointer"
        {...props}
    >
        {props.children}
    </span>
);

const CampgroundReservation: React.FC<CampgroundResvervationProps> = ({ campground }) => {
    const appContext = useContext(AppContext);
    const navigate = useNavigate();

    const [inputStartDate, setInputStartDate] = useState<string | null>(null);
    const [inputEndDate, setInputEndDate] = useState<string | null>(null);
    const [minEndDate, setMinEndDate] = useState('');
    const [guests, setGuests] = useState<number>(1);
    const [days, setDays] = useState(getDaysBetween(inputStartDate, inputEndDate));

    // numbers for calculations
    const [campgroundFee, setCampgroundFee] = useState(Number(campground.price * days).toFixed(2));
    const [guestsFee, setGuestsFee] = useState(guests * 5);
    const [totalBeforeTax, setTotalBeforeTax] = useState(
        Number(campgroundFee + guestsFee).toFixed(2),
    );
    const [totalAfterTax, setTotalAfterTax] = useState(Number(totalBeforeTax * 1.08).toFixed(2)); // tax = 8%
    const [discount, setDiscount] = useState(
        Number(parseInt(new Date().getDate())).toFixed(2) % 10,
    );
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(
        Number(totalAfterTax - (discount / 100) * totalAfterTax).toFixed(2),
    );

    const checkinDateRef = useRef(null);
    const checkoutDateRef = useRef(null);

    // input min requires date to be in yyyy-mm-dd format
    // Note that en-CA is a locale, not a timezone. Canada uses the YYYY-MM-DD format.
    const minStartDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

    useEffect(() => {
        if (!inputStartDate) setMinEndDate(minStartDate);
        else {
            setMinEndDate(getNextStartDays(inputStartDate));
            setDays(getDaysBetween(inputStartDate, inputEndDate));
        }
    }, [inputStartDate, inputEndDate]);

    // numbers for calculations
    // TODO: check calculations
    // const campgroundFee = Number(campground.price * days).toFixed(2);
    // const guestsFee = guests * 5;
    // const totalBeforeTax = Number(campgroundFee + guestsFee).toFixed(2);
    // const totalAfterTax = Number(totalBeforeTax * 1.08).toFixed(2); // tax = 8%
    // const discount = Number(parseInt(new Date().getDate())).toFixed(2) % 10; // lucky number based on the day. max 10% discount
    // const totalAfterDiscount = Number(totalAfterTax - (discount / 100) * totalAfterTax).toFixed(2);

    const makeReservation = () => {
        const reservation = {
            bookedBy: appContext.currentUser!.id,
            campground: campground._id,
            nights: days,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: parseInt(guests),
            totalPrice: totalAfterDiscount,
            status: 'PENDING',
        };

        axios.post('/api/v1/reservation/new', { reservation }).then(data => {
            console.log(data.data);
            navigate(`/reservation/${data.data._id}`);
        });
    };

    const reserveHandler = () => {
        if (!inputStartDate) {
            checkinDateRef.current!.showPicker();
            return;
        }

        if (!inputEndDate) {
            checkoutDateRef.current!.showPicker();
            return;
        }

        if (!appContext.currentUser) {
            appContext.setModal({ open: true, content: <ModalLogin />, requiresLoggedIn: true });
            return;
        }

        const reservation = {
            bookedBy: appContext.currentUser.id,
            campground: campground._id,
            nights: days,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: parseInt(guests),
            totalPrice: totalAfterDiscount,
            status: 'PENDING',
        };

        appContext.setModal({
            open: true,
            content: <ModalConfirmReservation reservation={reservation} makeReservation={makeReservation} />,
            requiresLoggedIn: true,
        });
    };

    return (
        <ReserveSection>
            {/* PRICE TAG */}
            <div className="flex flex-row justify-between items-center">
                <p className="">
                    <span className="font-bold text-2xl">${campground.price}</span>
                    <span> night</span>
                    <span className="text-muted text-base">{` (${USDtoVND(
                        campground.price,
                    )}₫)`}</span>
                </p>
                <span className="">{days > 0 && `${days} ${days === 1 ? 'night' : 'nights'}`}</span>
            </div>

            {/* DATE PICKER */}
            <div className="flex flex-row md:flex-col gap-5 mb-4">
                <div>
                    <Form.Label>Check-in</Form.Label>
                    <Form.Control
                        type="date"
                        min={minStartDate}
                        onChange={e => {
                            console.log(e.currentTarget.value);
                            // reset the input end date if user choses a date after endDate
                            if (
                                new Date(e.currentTarget.value).getTime() >
                                new Date(inputEndDate).getTime()
                            ) {
                                setInputEndDate(null);
                            }
                            setInputStartDate(e.currentTarget.value);
                        }}
                        ref={checkinDateRef}
                    />
                </div>
                <div>
                    <Form.Label>Checkout</Form.Label>
                    <Form.Control
                        type="date"
                        min={minEndDate}
                        onChange={e => {
                            setInputEndDate(e.currentTarget.value);
                        }}
                        ref={checkoutDateRef}
                    />
                </div>
            </div>

            {/* NUMBER OF GUESTS */}
            <div className="flex flex-row justify-between items-baseline">
                <Form.Label>Guests</Form.Label>
                <span className="flex flex-row items-baseline gap-3">
                    <InputButton onClick={() => guests > 1 && setGuests(g => g - 1)}>-</InputButton>
                    <span>
                        <Form.Control
                            type="text"
                            className="w-12 min-w-12 inline text-center"
                            value={guests}
                            onChange={e => {
                                if (e.currentTarget.value === '') {
                                    setGuests(1);
                                    return;
                                }
                                if (!isNaN(e.currentTarget.value))
                                    setGuests(parseInt(e.currentTarget.value));

                                if (e.currentTarget.value === 0) setGuests(1);
                            }}
                        />
                    </span>
                    <InputButton onClick={() => setGuests(g => g + 1)}>+</InputButton>
                </span>
            </div>

            <hr />
            {/* BILLING */}
            {inputEndDate && inputStartDate && (
                <div className="flex flex-column gap-1">
                    <div className="flex flex-row justify-between">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-semibold text-lg">${totalAfterDiscount}</span>
                    </div>

                    <div className="text-muted text-sm flex flex-row justify-between">
                        <span>🇻🇳 Vietnam Dong</span>
                        <span>{USDtoVND(totalAfterDiscount)}₫</span>
                    </div>

                    <Accordion className="my-2">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Show details
                        </AccordionSummary>
                        <AccordionDetails>
                            <div className="flex flex-row justify-between">
                                <span>Campground fee</span>
                                <span className="text-right">
                                    ${campground.price} × {days} {days > 1 ? 'nights' : 'night'} = $
                                    {campgroundFee}
                                </span>
                            </div>
                            <div className="flex flex-row justify-between">
                                <span>Service fee</span>
                                <span className="text-right">
                                    $5 × {guests} guests = ${guestsFee}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between">
                                <span>After taxes</span>
                                <span className="text-right">
                                    8% × ${totalBeforeTax} = ${totalAfterTax}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between text-red-500">
                                <span>After discount</span>
                                <span className="text-right">
                                    -{discount}% × ${totalAfterTax} = ${totalAfterDiscount}
                                </span>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                </div>
            )}

            <button
                className="w-full mt-4 bg-primary-dark-color text-primary-color transition ease-in-out outline-0 px-5 py-3 border-0 hover:text-white hover:bg-black duration-300"
                onClick={reserveHandler}
            >
                RESERVE →
            </button>
        </ReserveSection>
    );
};

export default CampgroundReservation;
