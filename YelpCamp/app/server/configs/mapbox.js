const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
module.exports = mbxGeocoding({ accessToken: process.env.MAP_BOX_ACCESS_TOKEN });
