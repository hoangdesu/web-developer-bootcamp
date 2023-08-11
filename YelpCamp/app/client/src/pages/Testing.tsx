import React from 'react';
import axios from 'axios';

const Testing = () => {
    return (
        <div>
            <h1>Testing upload</h1>
            <form action="http://localhost:3001/upload" method="post" encType="multipart/form-data">
                <input type="text" name="username" placeholder="Enter name" />
                {/* <input type="file" name="image" /> */}
                <input type="file" name="images" multiple />
                <button>Upload</button>
            </form>
        </div>
    );
};

export default Testing;
