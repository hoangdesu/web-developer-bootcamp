import React from 'react';

import PageContainer from '../components/PageContainer';
import styled from '@emotion/styled';
import Me from '../assets/hoangdesu.jpeg';
import MERN from '../assets/MERN.png';

const Div = styled.div`
    a {
        color: var(--primary-accent-color);
    }

    a:hover {
        color: #064733;
    }

    ul {
        list-style: '- ';
    }
`;

const About: React.FunctionComponent = () => {
    document.title = 'YelpCamp | About';
    return (
        <PageContainer>
            <Div>
                <h1 className="mb-3">About</h1>
                <div className="flex flex-col-reverse md:flex-row gap-4">
                    <div>
                        <p>Hi! 👋</p>
                        <p>
                            I'm glad you found this page. Thanks for checking out my version of
                            YelpCamp.
                        </p>
                        <p>
                            My name is Hoang, some people know me as Brian. I'm a software engineer
                            from Ho Chi Minh city, Vietnam 🇻🇳
                        </p>
                        <p>
                            YelpCamp is the final project from Colt Steele's course on Udemy{' '}
                            <a
                                href="https://www.udemy.com/course/the-web-developer-bootcamp/"
                                target="_blank"
                            >
                                The Web Developer Bootcamp
                            </a>
                            . It's a fullstack web application for browsing and sharing camping
                            sites around the world. Originally the app from the course is
                            server-side rendered using Node and EJS template engine. However, I
                            wanted to make something that I can proudly call "my own", not "just
                            another YelpCamp project", so I completely re-designed the app and built
                            it using the MERN stack with TypeScript for the client-side. Beside the
                            typical CRUD operations, I also implemented a bunch of extra features
                            like making reservations, user profile, simulated mobile payment with QR
                            code, etc.
                        </p>
                    </div>
                    <div>
                        <img src={Me} alt="hoangdesu avatar" className="rounded-full w-52" />
                    </div>
                </div>

                <div className="mt-4">
                    <h2>Technologies</h2>
                    <img src={MERN} alt="MERN stack" className="w-full max-w-xs" />
                    <h5>Frontend</h5>
                    <p className="inline">
                        The frontend is written in{' '}
                        <a href="https://github.com/facebook/react" target="_blank">
                            React 18
                        </a>
                        , with the following additional libraries:
                    </p>
                    <ul>
                        <li>
                            <a href="https://github.com/bitjson/qr-code" target="_blank">
                                @bitjson/qr-code
                            </a>
                            : web-component QR code generator for simulated mobile payment
                        </li>
                        <li>
                            <a href="https://github.com/axios/axios" target="_blank">
                                axios
                            </a>
                            : promise based HTTP client
                        </li>
                        <li>
                            <a href="https://github.com/bmcmahen/react-grid-dnd" target="_blank">
                                react-grid-dnd
                            </a>
                            : for drag and drop images in New Campground and Edit Campground pages
                        </li>
                        <li>
                            <a href="https://tanstack.com/query/v3/" target="_blank">
                                react-query (v3)
                            </a>
                            : powerful asynchronous state management, server-state utilities and
                            data fetching library
                        </li>
                        <li>
                            <a href="https://reactrouter.com/en/main" target="_blank">
                                react-router (v6)
                            </a>
                            : client side routing library
                        </li>
                    </ul>
                    <p className="inline">
                        Multiple <span className="font-medium">UI libraries</span> are combined for
                        the sake of learning and utilizing component customization:
                    </p>
                    <ul>
                        <li>
                            <a href="https://react-bootstrap.netlify.app/" target="_blank">
                                React Bootstrap
                            </a>
                        </li>
                        <li>
                            <a href="https://styled-components.com/" target="_blank">
                                styled-components
                            </a>
                        </li>
                        <li>
                            <a href="https://mui.com/" target="_blank">
                                Material UI
                            </a>
                        </li>
                        <li>
                            <a href="https://tailwindcss.com/" target="_blank">
                                Tailwind CSS
                            </a>
                        </li>
                    </ul>

                    <h5>Backend</h5>
                    <p className="inline">
                        The backend is powered{' '}
                        <a href="https://expressjs.com/" target="_blank">
                            Express
                        </a>{' '}
                        - a fast, unopinionated, minimalist web framework for{' '}
                        <a href="https://nodejs.org/en" target="_blank">
                            Node.js
                        </a>
                        .<br /> Additional libraries include:
                    </p>
                    <ul>
                        <li>
                            <a href="" target="_blank">
                                mongoose
                            </a>
                            : Object Data Modeling library for MongoDB and Node.js
                        </li>
                        <li>
                            <a href="https://github.com/expressjs/session" target="_blank">
                                express-session
                            </a>
                            : session middleware, paired with{' '}
                            <a href="https://github.com/jdesboeufs/connect-mongo" target="_blank">
                                connect-mongo
                            </a>{' '}
                            to store session in MongoDB
                        </li>
                        <li>
                            <a href="https://github.com/jaredhanson/passport" target="_blank">
                                Passport
                            </a>
                            : authentication middleware, paired with{' '}
                            <a href="https://github.com/jaredhanson/passport-local" target="_blank">
                                Local Strategy
                            </a>{' '}
                            and{' '}
                            <a
                                href="https://github.com/saintedlama/passport-local-mongoose"
                                target="_blank"
                            >
                                Passport Local Mongoose
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/expressjs/multer" target="_blank">
                                Multer
                            </a>{' '}
                            and{' '}
                            <a
                                href="https://github.com/affanshahid/multer-storage-cloudinary"
                                target="_blank"
                            >
                                multer-storage-cloudinary
                            </a>
                            : middleware for handling uploading images to Cloudinary
                        </li>

                        <li>
                            <a href="https://github.com/expressjs/morgan" target="_blank">
                                morgan
                            </a>
                            : HTTP request logger middleware
                        </li>
                        <li>
                            <a href="https://github.com/helmetjs/helmet" target="_blank">
                                helmet
                            </a>
                            : help secure Express apps with various HTTP headers
                        </li>
                        <li>
                            <a href="https://github.com/hapijs/joi" target="_blank">
                                joi
                            </a>
                            : data validation library
                        </li>
                        <li>
                            <a
                                href="https://github.com/apostrophecms/sanitize-html"
                                target="_blank"
                            >
                                sanitize-html
                            </a>
                            : HTML sanitizer for enhanced security
                        </li>
                    </ul>

                    <h5>Third-party APIs</h5>
                    <ul>
                        <li>
                            <a href="https://www.mapbox.com/" target="_blank">
                                Mapbox
                            </a>
                            : client APIs and server SDKs for map geolocation and geocoding services
                        </li>
                        <li>
                            <a href="https://cloudinary.com/" target="_blank">
                                Cloudinary
                            </a>
                            : image storage service
                        </li>
                    </ul>
                </div>

                <div className="mt-4">
                    <h2>How To</h2>
                    <h3>How to add a new campground?</h3>
                </div>

                <div className="mt-4">
                    <h2></h2>
                </div>

                <h2>Installation...</h2>

                <h2>Reflection?</h2>

                <div>
                    <h2> Connect with me </h2>* [Personal website](https://hoangdesu.com/) *
                    [LinkedIn](https://www.linkedin.com/in/hoangdesu/) *
                    [Facebook](https://www.facebook.com/Hoangdayo/) *
                    [Instagram](https://www.instagram.com/hoang.desu/) *
                    [Github](https://github.com/hoangdesu) * [Email](mailto:hoangdesu@gmail.com)
                </div>
            </Div>
            <div className="sticky top-10 right-0 float-right">
                <h1>table of content?</h1>
            </div>
        </PageContainer>
    );
};

export default About;
