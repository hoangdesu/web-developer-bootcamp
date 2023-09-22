const CampgroundBuilder = require('../utilities/builders.js');

const campground = new CampgroundBuilder()
    .withTitle('campground 1')
    .withPrice('campground 1')
    .withLocation('campground 1')
    .withGeometry('campground 1')
    .withImages('campground 1')
    .withAuthor('hà nội')
    .withReviews('hà nội')
    .withReservations('hà nội')
    .build();

console.log(campground);
