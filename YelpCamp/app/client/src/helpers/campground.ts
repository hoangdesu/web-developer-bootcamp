

export const isAuthor = (appContext, campground) => {
    if (appContext.currentUser) return campground.author?._id === appContext.currentUser.id;
    return false;
};

export const formatDate = createdTime => {
    const date = new Date(createdTime);
    const { format } = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        dateStyle: 'full',
        timeStyle: 'long',
    });

    return `${format(date)}`;
};

export const timeDifference = (current, previous) => {
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

const USDtoVND = (usd: number) => {
    return `${(usd * 24000).toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`;
};

export const formattedPrice = (price: number) => `$${price}/night (~${USDtoVND(price)})`;

export const averageRating = (campground) => {
    const result = (
        campground?.reviews?.reduce((accumulator, review) => accumulator + review.rating, 0) /
        campground?.reviews?.length
    ).toFixed(1);
    if (result === 'NaN') return '-';
    return result;
};