import React, { useState, useRef, useEffect, useContext, FormEvent } from 'react';
import styled from '@emotion/styled';
import { Campground } from '../../types';
import { USDtoVND, getDaysBetween, getNextStartDays } from '../../helpers/campground';
import { Form, OverlayTrigger, Tooltip as BSTooltip, InputGroup } from 'react-bootstrap';
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

const DISCOUNT_CODES = {
    HOANGDEPTRAI: 90,
    YELPCAMP: 10,
    A: 2
};

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
        discount: {
            amount: 0,
            code: '',
            valid: null,
            percentage: 0
        },
        totalAmount: 0,
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
        const serviceFee = guests * 2; // $2 for each guest

        const totalBeforeTax = campgroundFee + serviceFee;
        const taxes = totalBeforeTax * 0.08; // tax = 8%
        // const totalAfterTaxes = totalBeforeTax + taxes;

        const totalAmount = totalBeforeTax + taxes;
        

        // const discountPercentage = (new Date().getDate() % 10) / 100; // lucky number based on the day. max 10% discount
        // const discount = totalAfterTaxes * discountPercentage;

        // const totalAmount = totalAfterTaxes - fees.discount;
        // totalAfterTaxes - (discount / 100) * totalAfterTaxes;

        setFees(prev => ({
            ...prev,
            campgroundFee,
            serviceFee,
            taxes,
            totalAmount,
        }));
    }, [nights, guests]);

    // const calculateFees = (guests,)

    // input min requires date to be in yyyy-mm-dd format
    // Note that en-CA is a locale, not a timezone. Canada uses the YYYY-MM-DD format.
    const minStartDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' });

    // numbers for calculations
    const [campgroundFee, setCampgroundFee] = useState(
        Number(campground.price * nights).toFixed(2),
    );
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

    // numbers for calculations
    // TODO: check calculations
    // const campgroundFee = Number(campground.price * nights).toFixed(2);
    // const guestsFee = guests * 5;
    // const totalBeforeTax = Number(campgroundFee + guestsFee).toFixed(2);
    // const totalAfterTax = Number(totalBeforeTax * 1.08).toFixed(2); // tax = 8%
    // const discount = Number(parseInt(new Date().getDate())).toFixed(2) % 10; // lucky number based on the day. max 10% discount
    // const totalAfterDiscount = Number(totalAfterTax - (discount / 100) * totalAfterTax).toFixed(2);

    const makeReservation = () => {
        const reservation = {
            bookedBy: appContext.currentUser!.id,
            campground: campground._id,
            nights: nights,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: guests,
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
            nights: nights,
            checkIn: inputStartDate,
            checkOut: inputEndDate,
            guests: guests,
            totalPrice: totalAfterDiscount,
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

    const applyDiscount = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        console.log(
            'discountCouponRef.current.value',
            discountCouponRef.current.value.toUpperCase(),
        );

        if (fees.discount.code.toUpperCase() in DISCOUNT_CODES) {
            // console.log('discountPercentage',discountPercentage);
            const percentage = DISCOUNT_CODES[discountCode];
            const amount = percentage * fees.totalAmount; // todo calculaet this shit


            // TODO: work on discount section
            // only show after checking discount code
            setFees(fees => ({
                ...fees,
                discount: {
                    amount,
                    percentage,
                    valid: true
                }
            }));
        } else {
            setFees(fees => ({
                ...fees,
                discount: {
                    valid: null
                }
            }));
        }
        // discountCouponRef.current.value = '';
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
                <span>
                    {nights > 0 && `${nights} ${nights === 1 ? 'night' : 'nights'}`}
                </span>
            </div>
            {/* DATE PICKER */}
            <div className="flex flex-row md:flex-col justify-between gap-5 mb-4">
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
                                arrow
                            >
                                <div className="flex flex-row justify-between">
                                    <span>Campground fee</span>
                                    <span className="text-right">
                                        ${Number(fees.campgroundFee).toFixed(2)}
                                    </span>
                                </div>
                            </Tooltip>
                            <Tooltip title={`$2 × ${guests} guests`} placement="right" arrow>
                                <div className="flex flex-row justify-between">
                                    <span>Service fee ($2/guest)</span>
                                    <span className="text-right">
                                        ${Number(fees.serviceFee).toFixed(2)}
                                    </span>
                                </div>
                            </Tooltip>

                            <Tooltip
                                title={`$Total before taxes: $${1} × 8% taxes`}
                                placement="right"
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
                            <Form onSubmit={applyDiscount}>
                                <InputGroup>
                                    <Form.Control
                                        placeholder="Discount coupon"
                                        aria-label="Recipient's username with two button addons"
                                        ref={discountCouponRef}
                                    />
                                    {/* TODO: style this button with rounded top and bottom right corners. Choose different design/color */}
                                    <button
                                        className="border-0 bg-primary-dark-color text-primary-color px-3 text-sm hover:bg-primary-color hover:text-primary-dark-color hover:border-1 hover:border-black"
                                        type="submit"
                                    >
                                        Apply
                                    </button>
                                </InputGroup>
                            </Form>

                            {fees.discount.amount > 0 ? (
                                <>
                                    <p className='mt-2 text-sm text-muted text-center'>
                                        {`Applied coupon ${discountCouponRef.current.value.toUpperCase()} successfully!`}
                                    </p>
                                    <Tooltip title="DISCOUNT" placement="right" arrow>
                                        <div className="flex flex-row justify-between text-red-500">
                                            <span>Discount ({}%)</span>
                                            <span className="text-right">
                                                -${Number(fees.discount).toFixed(2)}
                                            </span>
                                        </div>
                                    </Tooltip>
                                </>
                            ) : (<p className='mt-2 text-sm text-muted text-center'>
                            {`Invalid discount coupon`}
                        </p>)}
                        </AccordionDetails>
                    </Accordion>

                    <div className="flex flex-row justify-between mt-3">
                        <span className="font-semibold text-lg">Total amount</span>
                        <span className="font-semibold text-xl">
                            ${Number(fees.totalAmount).toFixed(2)}
                        </span>
                    </div>

                    <div className="text-muted text-sm flex flex-row justify-between">
                        <span>🇻🇳 Vietnam Dong</span>
                        <span>{USDtoVND(fees.totalAmount)}₫</span>
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
