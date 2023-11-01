[x] change title on every page
[x] favicon
[] default campground image

[x] pagination
[x] cluster map popup
[x] clicking on campground bug => FIXED: SET closeOnClick={false} on Popup

[x] explore 102 campgrounds -> make catchy title text
[x] style Campground page
[] search page -> with other filters
[x] share button -> modal
[] measure distance with turf
https://stackoverflow.com/questions/69520848/how-to-get-distance-between-two-coordinates-with-mapbox
https://labs.mapbox.com/education/proximity-analysis/point-distance/

[x] style Campground page
[x] modal elements
[] QR payment

[] random a campground
[] share modal
[] design web flows + ui
[x] review box time
[x] fix edit button

[x] reusable modal

[x] refactor pagecontainer to contain main sections of a page

[x] replace confirm popups with modals

[x] fix reservation calculations
[x] alerts fk up the UI -> replace important ones with snackbars

[x] login screen ui
[x] register screen ui
[] reservation modal

[x] reset password page
[] search page

[x] pagination color
[x] Login to add your review text
[] mobile pay screen: user must enter correct password to pay

[] campgrounds you may like (random)

[x] MODAL CONFIRM RESERVATION

[x] Edit + new campground pages

[x] Campground Thumbnail grid
[x] campground marker style
[x] clustermap error: try using useEffect to reset state for popup

[x] map preview in edit and new campground

[x] move flash alert down, inside container

[x] drag and drop for grid images in edit and new campground pages

[x] remove "featured image" in edit. implement drag and drop. use PreviewMap

// note on edit page:

uploading data:
{
    ...
    current images array[]
    new images[] to updload
    images[] to delete -> soft delete -> user click on delete = dont delete, just add to this array and blur image 
}

if possible: can use 1 array to preview / edit images. or just use 2 arrays :/

[x] fix DraggableImage type
[x] fix editcampground map

[x] finish edit campground

[] style search page
[] error page
[] profile page TODOs

[] ModalLogin should perform next action
PROBLEMS:
[FIXED] - check session / cookies from the back end. No sessionId (connect.sid) is set on the browser. Using proxy server DOES work for some reason :/ ?
[FIXED] - cannot enter path directly into browser e.g. site.com/login. Have to use router?

[FIXED] - Another problem: EditCampground -> request to mapbox api is blocked by CORS policy

[] style navbar on mobile
[] SEO meta tags
[] sitemap, robots.txt or sth similar for SEO

[] improve navbar navigation in mobile view
[x] change /user paths to /users

[] finish reservation
RESERVATION TODOS:
*need heavy works on <Reservation />

- navigate to /reservations/:id
- rename resv page
- change api endpoints

- /reservations/:id
- /reservations/:id/confirm -> mobile view, rename this component

[] Checkout page

[x] Loading page spinner is not center

[] less padding for NewCampground on mobile

[] https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition

[] add subtotal to reservation and modal + checkout page

[] implement scroll to top on page navigation with either scroll to top or scroll restorartion component + take note

[] change component App to Home
