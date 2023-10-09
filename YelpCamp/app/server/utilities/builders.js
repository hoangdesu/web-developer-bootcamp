class CampgroundBuilder {
    constructor() {
        this.title;
        this.price;
        this.description;
        this.location;
        this.geometry;
        this.images;
        this.author;
    }

    withTitle(title) {
        this.title = title;
        return this;
    }

    withPrice(price) {
        this.price = price;
        return this;
    }

    withDescription(description) {
        this.description = description;
        return this;
    }

    withLocation(location) {
        this.location = location;
        return this;
    }

    withGeometry(geometry) {
        this.geometry = geometry;
        return this;
    }

    withImages(images) {
        this.images = images;
        return this;
    }

    withAuthor(author) {
        this.author = author;
        return this;
    }

    build() {
        return {
            title: this.title,
            price: this.price,
            description: this.description,
            location: this.location,
            geometry: this.geometry,
            images: this.images,
            author: this.author,
        };
    }
}

module.exports = CampgroundBuilder;
