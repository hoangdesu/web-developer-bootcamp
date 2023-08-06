export const USDtoVND = (usd: number) => {
    return `${(usd * 24000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₫`;
};
