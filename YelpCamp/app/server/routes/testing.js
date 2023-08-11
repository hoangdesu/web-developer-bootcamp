const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const parser = require('../configs/cloudinary');
const { resetDb } = require('../seeds');
const Review = require('../models/review');

// for testing only
router.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

// reset database, seeding new & random data
router.get('/resetdb', (req, res) => {
    const { count = 1 } = req.params;
    resetDb(count);
    res.status(200).send('db has been reset');
});

// get all reviews route
router.get('/reviews', async (req, res, next) => {
    res.status(200).json(await Review.find({}));
});

// testing file upload & cloudinary
router.post(
    '/upload',
    // parser.single('image'),
    parser.array('images'),
    (req, res) => {
        console.log('uploading...');
        // res.send('upload');
        res.json({
            body: req.body,
            // file: req.file || null,
            files: req.files,
        });
    },
);

// delete resources route
router.delete('/image/:id', (req, res) => {
    const { id } = req.params;
    cloudinary.api
        .delete_resources([id], {
            type: 'upload',
            resource_type: 'image',
        })
        .then(res => {
            console.log(`deleted resource id ${id} success`, res);
            res.send('deleted');
        });
});

module.exports = router;
