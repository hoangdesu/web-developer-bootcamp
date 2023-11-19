import { averageRating } from '../helpers/campground';
import { Campground } from '../types';

export const shuffle = (arr: Campground[]): Campground[] => {
    let randomIndex;
    for (let i = 0; i < arr.length; i++) {
        randomIndex = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
};

export const sort = (
    campgrounds: Campground[],
    prop: 'price' | 'rating',
    value: 'lowToHigh' | 'highToLow',
): Campground[] => {
    const sortedCampgrounds = [...campgrounds];

    if (prop === 'price') {
        sortedCampgrounds.sort(function (cg1, cg2) {
            if (value === 'lowToHigh') {
                return cg1.price - cg2.price;
            } else {
                return cg2.price - cg1.price;
            }
        });
    }

    if (prop === 'rating') {
        sortedCampgrounds.sort(function (cg1, cg2) {
            if (value === 'lowToHigh') {
                if (averageRating(cg1) === 'New') {
                    return -1;
                } else if (averageRating(cg2) === 'New') {
                    return 1;
                } else {
                    return averageRating(cg1) - averageRating(cg2);
                }
            } else {
                return averageRating(cg2) - averageRating(cg1);
            }
        });
    }

    return sortedCampgrounds;
};
