import { Campground } from '../types';

export const isAuthor = (appContext, campground) => {
    if (appContext.currentUser) return campground.author?._id === appContext.currentUser.id;
    return false;
};

export const formatDate = (createdTime: string) => {
    const date = new Date(createdTime);
    const { format } = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        dateStyle: 'full',
        timeStyle: 'long',
    });

    return `${format(date)}`;
};

export const timeDifference = (current: number, previous: number) => {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
};

export const USDtoVND = (usd: number) => {
    return `${(usd * 25000)
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formattedPrice = (price: number) => `$${price}/night (~${USDtoVND(price)})`;

export const averageRating = (campground: Campground) => {
    const result = (
        campground?.reviews?.reduce((accumulator, review) => accumulator + review.rating, 0) /
        campground?.reviews?.length
    ).toFixed(1);
    if (result === 'NaN') return 'New';
    return result;
};

export const getNextStartDays = inputStartDate => {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const startDate = new Date(inputStartDate);
    const nextDate = new Date(startDate.getTime() + ONE_DAY);
    const nextDateStr = nextDate.toISOString().slice(0, 10);
    // console.log(nextDateStr);
    return nextDateStr;
};

export const getDaysBetween = (startDate: string, endDate: string) => {
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // When you subtract a Date object from another Date object (in JavaScript), they both get implicitly converted to a number that represents the milliseconds elapsed between January 1st, 1970 and the given date
    // => use getTime()
    const differenceMs = Math.round(new Date(endDate).getTime() - new Date(startDate).getTime());

    const days = Math.round(differenceMs / ONE_DAY);

    return days;
};
