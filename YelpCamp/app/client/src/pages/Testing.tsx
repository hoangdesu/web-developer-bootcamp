import React from 'react';
import { Link } from 'react-router-dom';

const Testing = () => {
    const reader = new FileReader();

    const [selectedImages, setSelectedImages] = React.useState([]);

    const changeHandler = e => {
        // if (e.target.files && e.target.files.length > 0) {
        //     setSelectedImages(e.target.files[0]);
        // }

        const images = Array.from(e.target.files).map(f => f);
        console.log(images);
        setSelectedImages(images);
    };

    return (
        <div>
            <div>
                <Link to="/">Home</Link>
            </div>

            <h1>Testing upload</h1>
            <form
                action="http://localhost:3001/testing/upload"
                method="post"
                encType="multipart/form-data"
            >
                <input type="text" name="username" placeholder="Enter name" />
                {/* <input type="file" name="image" /> */}
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={changeHandler}
                />
                {selectedImages && (
                    <div
                    //   style={styles.preview}
                    >
                        {selectedImages &&
                            selectedImages.map(img => (
                                <img
                                    key={img}
                                    src={URL.createObjectURL(img)}
                                    // src={URL.createObjectURL('https://res.cloudinary.com/hoangdesu/image/upload/w_200/v1691787172/YelpCamp/mr9j3h7y5qpjfhcdwaf9.jpg')} // cannot
                                    // style={styles.image}
                                    style={{ width: '200px' }}
                                    alt="Thumb"
                                />
                            ))}
                    </div>
                )}
                <button>Upload</button>
            </form>

            <h1>Testing form</h1>
            <form
                action="http://localhost:3001/testing/delete-images-array"
                method="post"
                // encType="multipart/form-data" // must NOT be this type for the array to work
                // encType="application/json"
            >
                <div>
                    <label htmlFor="1">1</label>
                    <input type="checkbox" id="1" name="deleteImages[]" value="1" />
                </div>

                <div>
                    <label htmlFor="2">2</label>
                    <input type="checkbox" id="2" name="deleteImages[]" value="2" />
                </div>

                <div>
                    <label htmlFor="3">3</label>
                    <input type="checkbox" id="3" name="deleteImages[]" value="3" />
                </div>
                <button>Submit</button>
            </form>

            <h1>Seed database</h1>
            <form action={`http://localhost:3001/testing/resetdb`} method="get">
                <input type="text" name="count" id="" placeholder="campgrounds (default=5)" />
                <button type="submit">Reseed database</button>
            </form>
        </div>
    );
};

export default Testing;
