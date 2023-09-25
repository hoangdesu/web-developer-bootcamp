import React, { useState, useRef, useEffect, useContext, FormEvent } from 'react';
import styled from '@emotion/styled';
import { Campground } from '../../types';
import { USDtoVND, getDaysBetween, getNextStartDays } from '../../helpers/campground';
import { Form, InputGroup } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import AppContext from '../../store/app-context';
import { useNavigate } from 'react-router-dom';
import ModalConfirmReservation from '../../components/Modals/ModalConfirmReservation';
import ModalLogin from '../../components/Modals/ModalLogin';
import { Tooltip } from '@mui/material';
import ApplyButton from '../../components/Buttons/ApplyButton';

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
    const [nights, setNights] = useState(
        getDaysBetween(inputStartDate as string, inputEndDate as string),
    );
    const [fees, setFees] = useState({
        campgroundFee: 0,
        serviceFee: 0,
        taxes: 0,
        totalBeforeTaxes: 0,
        totalAfterTaxes: 0,
        totalAfterDiscount: 0,
    });
    const [discount, setDiscount] = useState({
        amount: 0,
        show: false,
        valid: false,
        code: '',
        percentage: 0,
    });

    const checkinDateRef = useRef(null);
    const checkoutDateRef = useRef(null);
    const discountCouponRef = useRef(null);

    useEffect(() => {
        if (!inputStartDate) setMinEndDate(minStartDate);
        else {
            setMinEndDate(getNextStartDays(inputStartDate));
            setNights(getDaysBetween(inputStartDate as string, inputEndDate as string));
        }
    }, [inputStartDate, inputEndDate]);

    useEffect(() => {
        const campgroundFee = campground.price * nights;
        const serviceFee = guests * 2 * nights; // $2 for each guest/night

        const totalBeforeTaxes = campgroundFee + serviceFee;
        const taxes = totalBeforeTaxes * 0.08; // tax = 8%

        const totalAfterTaxes = totalBeforeTaxes + taxes;
        const totalAfterDiscount = totalAfterTaxes;

        // const discountPercentage = (new Date().getDate() % 10) / 100; // lucky number based on the day. max 10% discount
        // const discount = totalAfterTaxes * discountPercentage;

        // const totalAmount = totalAfterTaxes - fees.discount;
        // totalAfterTaxes - (discount / 100) * totalAfterTaxes;

        setFees(prev => ({
            ...prev,
            campgroundFee,
            serviceFee,
            taxes,
            totalBeforeTaxes,
            totalAfterTaxes,
            totalAfterDiscount,
        }));
    }, [nights, guests]);

    // input min requires date to be in yyyy-mm-dd format
    // Note that en-CA is a locale, not a timezone. Canada uses the YYYY-MM-DD format.
    const minStartDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

    const makeReservation = () => {
        const reservation = {
            bookedBy: appContext.currentUser!.id,
            campground: campground._id,
            nights: nights,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: guests,
            totalPrice: 1, //
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
            nights: nights,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: guests,
            totalPrice: 1, //
            status: 'PENDING',
        };

        appContext.setModal({
            open: true,
            content: (
                <ModalConfirmReservation
                    reservation={reservation}
                    makeReservation={makeReservation}
                />
            ),
            requiresLoggedIn: true,
        });
    };

    const EditButton = styled.button`
        /* border: 1px solid black; */
        background-color: transparent;
        padding: 2px 20px;
        /* font-size: 14px; */
        /* height: fit-content; */
        border: inherit;
        transition: 100ms ease;
        &:hover {
            color: #fffcf9;
            background-color: #222325;
        }
    `;

    const applyDiscountCode = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        if (!discountCouponRef.current.value) {
            setDiscount(prev => ({
                ...prev,
                show: false,
                valid: false,
                amount: 0,
                code: '',
                percentage: 0,
            }));
            setFees(prev => ({
                ...prev,
                totalAfterDiscount: prev.totalAfterTaxes,
            }));
            return;
        }

        if (discountCouponRef.current) {
            axios.get('/api/v1/reservation/discount-codes').then(res => {
                const { data: DISCOUNT_CODES } = res;
                const discountCode = discountCouponRef.current.value.toUpperCase();

                if (discountCode in DISCOUNT_CODES) {
                    const percentage = DISCOUNT_CODES[discountCode];
                    const discountAmount = (fees.totalAfterTaxes * percentage) / 100;
                    const totalAfterDiscount = fees.totalAfterTaxes - discountAmount;
                    setDiscount(prev => ({
                        ...prev,
                        amount: discountAmount,
                        show: true,
                        valid: true,
                        code: discountCode,
                        percentage,
                    }));
                    setFees(prev => ({
                        ...prev,
                        totalAfterDiscount,
                    }));
                } else {
                    setDiscount(prev => ({
                        ...prev,
                        show: true,
                        valid: false,
                        amount: 0,
                        code: '',
                        percentage: 0,
                    }));
                    setFees(prev => ({
                        ...prev,
                        totalAfterDiscount: prev.totalAfterTaxes,
                    }));
                }
            });
        }
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
                <span>{nights > 0 && `${nights} ${nights === 1 ? 'night' : 'nights'}`}</span>
            </div>
            {/* DATE PICKER */}
            <div className="flex flex-row md:flex-col justify-between gap-5 mb-4">
                <div>
                    <Form.Label>Check-in</Form.Label>
                    <Form.Control
                        type="date"
                        min={minStartDate}
                        onChange={e => {
                            // reset the input end date if user choses a date after endDate
                            if (
                                new Date(e.currentTarget.value).getTime() >
                                new Date(inputEndDate as string).getTime()
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
                                if (!isNaN(parseInt(e.currentTarget.value)))
                                    setGuests(parseInt(e.currentTarget.value));

                                if (parseInt(e.currentTarget.value) === 0) setGuests(1);
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
                    <Accordion className="my-2">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            Show details
                        </AccordionSummary>

                        <AccordionDetails>
                            <Tooltip
                                title={`$${campground.price} × ${nights} nights`}
                                placement="right"
                                enterDelay={200}
                                arrow
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Campground fee</span>
                                    <span className="text-right">
                                        ${Number(fees.campgroundFee).toFixed(2)}
                                    </span>
                                </div>
                            </Tooltip>

                            <Tooltip
                                title={`$2 × ${guests} guests`}
                                placement="right"
                                enterDelay={200}
                                arrow
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Service fee ($2/guest/night)</span>
                                    <span className="text-right">
                                        ${Number(fees.serviceFee).toFixed(2)}
                                    </span>
                                </div>
                            </Tooltip>

                            <Tooltip
                                title={`Total before taxes: $${fees.totalBeforeTaxes} × 8%`}
                                placement="right"
                                enterDelay={200}
                                arrow
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Taxes (8%)</span>
                                    <span className="text-right">
                                        ${Number(fees.taxes).toFixed(2)}
                                    </span>
                                </div>
                            </Tooltip>
                            <hr />
                            {/* DISCOUNT CODE */}
                            <Form onSubmit={applyDiscountCode}>
                                <InputGroup>
                                    <Tooltip
                                        title="Try HOANGDEPTRAI!"
                                        placement="top"
                                        enterDelay={500}
                                        arrow
                                    >
                                        <Form.Control
                                            placeholder="Discount coupon"
                                            aria-label="Enter discount coupon"
                                            ref={discountCouponRef}
                                        />
                                    </Tooltip>
                                    {/* TODO: style this button with rounded top and bottom right corners. Choose different design/color */}
                                    {/* <button
                                        className="border-0 bg-primary-dark-color text-primary-color px-3 text-sm hover:bg-primary-color hover:text-primary-dark-color hover:border-1 hover:border-black"
                                        type="submit"
                                    >
                                        Apply
                                    </button> */}
                                    <ApplyButton>Apply</ApplyButton>
                                </InputGroup>
                            </Form>
                            {discount.show && (
                                <>
                                    <p className="my-2 text-sm text-muted text-center">
                                        {discount.valid
                                            ? `Applied coupon ${discount.code} successfully!`
                                            : 'Invalid discount coupon'}
                                    </p>
                                    {discount.percentage > 0 && (
                                        <div className="flex flex-row justify-between text-red-500">
                                            <span>Discount ({discount.percentage}%)</span>
                                            <span className="text-right">
                                                -${Number(discount.amount).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </AccordionDetails>
                    </Accordion>

                    <div className="flex flex-row justify-between mt-3">
                        <span className="font-semibold text-lg">Total amount</span>
                        <span className="font-semibold text-xl">
                            ${Number(fees.totalAfterDiscount).toFixed(2)}
                        </span>
                    </div>
                    <div className="text-muted text-sm flex flex-row justify-between">
                        <span>🇻🇳 Vietnam Dong</span>
                        <span>{USDtoVND(fees.totalAfterDiscount)}₫</span>
                    </div>
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
