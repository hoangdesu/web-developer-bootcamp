[x] change title on every page [x] favicon [x] default campground image

[x] pagination [x] cluster map popup [x] clicking on campground bug => FIXED: SET
closeOnClick={false} on Popup

[x] explore 102 campgrounds -> make catchy title text [x] style Campground page [x] share button ->
modal

[x] style Campground page [x] modal elements [x] QR payment

[x] share modal [x] design web flows + ui [x] review box time [x] fix edit button

[x] reusable modal

[x] refactor pagecontainer to contain main sections of a page

[x] replace confirm popups with modals

[x] fix reservation calculations [x] alerts fk up the UI -> replace important ones with snackbars

[x] login screen ui [x] register screen ui [x] reservation modal

[x] reset password page

[x] pagination color [x] Login to add your review text [x] mobile pay screen: user must enter
correct password to pay

[x] MODAL CONFIRM RESERVATION

[x] Edit + new campground pages

[x] Campground Thumbnail grid [x] campground marker style [x] clustermap error: try using useEffect
to reset state for popup

[x] map preview in edit and new campground

[x] move flash alert down, inside container

[x] drag and drop for grid images in edit and new campground pages

[x] remove "featured image" in edit. implement drag and drop. use PreviewMap

// note on edit page:

uploading data: { ... current images array[] new images[] to updload images[] to delete -> soft
delete -> user click on delete = dont delete, just add to this array and blur image }

if possible: can use 1 array to preview / edit images. or just use 2 arrays :/

[x] fix DraggableImage type [x] fix editcampground map

[x] finish edit campground

[x] error page

PROBLEMS: [FIXED] - check session / cookies from the back end. No sessionId (connect.sid) is set on
the browser. Using proxy server DOES work for some reason :/ ? [FIXED] - cannot enter path directly
into browser e.g. site.com/login. Have to use router?

[FIXED] - Another problem: EditCampground -> request to mapbox api is blocked by CORS policy

[x] style navbar on mobile [] SEO meta tags [] sitemap, robots.txt or sth similar for SEO

[x] improve navbar navigation in mobile view [x] change /user paths to /users

[x] finish reservation RESERVATION TODOS: \*need heavy works on <Reservation />

-   navigate to /reservations/:id
-   rename resv page
-   change api endpoints

-   /reservations/:id
-   /reservations/:id/confirm -> mobile view, rename this component

[x] Checkout page

[x] Loading page spinner is not center

[x] less padding for NewCampground on mobile

[x] https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition

[x] add subtotal to reservation and modal + checkout page

[x] implement scroll to top on page navigation with either scroll to top or scroll restorartion
component

-   take note

[x] different hover colors/effects for primary and secondary buttons

[x] wording: Save vs Favorite campground

[x] hide scrolls on chrome windows

[x] ModalLogin should perform next action

[x] some pages missing favicon

[x] fix error cant reserve after login

[x] search page

[x] profile page TODOs

[x] Display Warning for Unsaved Form Data on Page Exit
https://claritydev.net/blog/display-warning-for-unsaved-form-data-on-page-exit

[x] owned

[x] remove endpoint to reservation page (and page component) 
[x] Delete Review modal [x] show length in user's fav and owned campgrounds

[] populate data

[x] reservation tab

[x] Save review? modal

[x] navbar design:
-   thu hep khoang cach from top to map
-   always show search bar on mobile (2 rows)
-   replace nav dropdown with simple dropdown to avoid changing nav height

[x] default image on map view

[x] Error. User not found -> redirect back to Home with alert

[x] show total campgrounds in homepage (1-12 of 24 campgrounds)

[x] campground image custom modal

[x] styling footer

[x] same design in other tabs (underline + subtitle)

[x] Empty reservations 

[x] User info input spacings 

[x] Server running at http://localhost: [] resv
id? 

[x] footer

[x] error boundary page

[x] fix footer on mobile

[x] image modal left/right arrow + keyboard inputs
