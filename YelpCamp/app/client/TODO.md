[x] change title on every page
[x] favicon
[] default campground image

[x] pagination
[x] cluster map popup
[] clicking on campground bug

[x] explore 102 campgrounds -> make catchy title text
[] style Campground page
[] search page -> with other filters
[x] share button -> modal
[] measure distance with turf
https://stackoverflow.com/questions/69520848/how-to-get-distance-between-two-coordinates-with-mapbox
https://labs.mapbox.com/education/proximity-analysis/point-distance/

[] style Campground page
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
[] alerts fk up the UI -> replace important ones with snackbars

[x] login screen ui
[] register screen ui
[] reservation modal

[x] reset password page
[] search page

[x] pagination color
[] Login to add your review text
[] mobile pay screen: user must enter correct password to pay

[] campgrounds you may like (random)

[x] MODAL CONFIRM RESERVATION

[] Edit + new campground pages

[] Campground Thumbnail grid
[] campground marker style
[] clustermap error: try using useEffect to reset state for popup

[] map preview in edit and new campground

[x] move flash alert down, inside container

[] drag and drop for grid images in edit and new campground pages

[] remove "featured image" in edit. implement drag and drop. use PreviewMap

// note on edit page:

uploading data:
{
    ...
    current images array[]
    new images[] to updload
    images[] to delete -> soft delete -> user click on delete = dont delete, just add to this array and blur image 
}

if possible: can use 1 array to preview / edit images. or just use 2 arrays :/

[] fix DraggableImage type
[] fix editcampground map

finish edit campground