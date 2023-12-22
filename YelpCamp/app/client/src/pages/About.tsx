import React from 'react';

import PageContainer from '../components/PageContainer';
import styled from '@emotion/styled';

import Me from '../assets/hoangdesu.jpeg';
import MERN from '../assets/MERN.png';
import TypeScript from '../../../../imgs/ts-logo.png';

import Home from '../../../../imgs/home.jpg';
import HomeMob from '../../../../imgs/home-mobile.jpg';
import Campground from '../../../../imgs/campground1.jpg';
import CampgroundMob from '../../../../imgs/campground-mobile.jpg';
import NewCamp from '../../../../imgs/new-campground.jpg';
import NewCampMob from '../../../../imgs/new-campground-mobile.jpg';
import EditCamp from '../../../../imgs/edit.jpg';
import EditCampMob from '../../../../imgs/edit-mobile.jpg';
import SearchFilter from '../../../../imgs/search-filter.jpg';
import SearchFilterMob from '../../../../imgs/search-filter-mobile.jpg';
import Checkout from '../../../../imgs/checkout.jpg';
import CheckoutMob from '../../../../imgs/checkout-mobile.jpg';
import User from '../../../../imgs/user.jpg';
import UserMob from '../../../../imgs/user-mobile.jpg';

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
                            My name is Brian. I'm a software engineer from Ho Chi Minh city, Vietnam
                            🇻🇳
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

                        <p>
                            The source code for this project is available at:{' '}
                            <a
                                href="https://github.com/hoangdesu/web-developer-bootcamp/tree/master/YelpCamp"
                                target="_blank"
                            >
                                https://github.com/hoangdesu/web-developer-bootcamp/tree/master/YelpCamp
                            </a>
                        </p>
                    </div>
                    <div>
                        <img src={Me} alt="hoangdesu avatar" className="rounded-full w-52" />
                    </div>
                </div>
                <div className="mt-4">
                    <h2>Technologies</h2>
                    <img src={MERN} alt="MERN stack" className="max-w-xs" />
                    <img src={TypeScript} alt="TypeScript logo" className="max-w-xs" />
                    <h5>Frontend</h5>
                    <p className="inline">
                        The frontend is written in{' '}
                        <a href="https://github.com/facebook/react" target="_blank">
                            React 18
                        </a>{' '}
                        using{' '}
                        <a href="https://www.typescriptlang.org/" target="_blank">
                            TypeScript
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
                        The backend is powered by{' '}
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
                            <a href="https://mongoosejs.com/" target="_blank">
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
                    <h2>Installation</h2>
                    <h5>Running locally</h5>
                    <p>
                        Clone the project:
                        <br />
                        <code>
                            $ git clone https://github.com/hoangdesu/web-developer-bootcamp.git
                        </code>
                    </p>
                    <p>
                        From the <code>web-developer-bootcamp</code> folder, navigate to YelpCamp
                        directory: <br />
                        <code>$ cd YelpCamp</code>
                    </p>
                    <p>
                        Install{' '}
                        <a href="https://classic.yarnpkg.com/en/" target="_blank">
                            yarn
                        </a>{' '}
                        (optional): <br /> <code>$ npm install --global yarn</code>
                    </p>
                    <p>
                        Run the following commands to install dependencies:
                        <br />
                        <code>$ yarn</code> <br />
                        <code>$ yarn run install:all</code>
                    </p>
                    <p>
                        Install{' '}
                        <a
                            href="https://www.mongodb.com/docs/manual/administration/install-community/"
                            target="_blank"
                        >
                            MongoDB Community Edition
                        </a>
                        . Start the database: <br /> <code>$ yarn run start:db</code>
                    </p>
                    <p>
                        Start all services: <br />
                        <code>$ yarn run start:all:dev</code>
                    </p>
                    <p>
                        🚀 Frontend will be available at{' '}
                        <a href="http://localhost:5173" target="_blank">
                            http://localhost:5173
                        </a>
                        , backend at{' '}
                        <a href="http://localhost:3001" target="_blank">
                            http://localhost:3001
                        </a>
                    </p>

                    <h5>Running with Docker</h5>
                    <p>
                        Install{' '}
                        <a href="https://www.docker.com/" target="_blank">
                            Docker
                        </a>
                        . Make sure Docker daemon is running.
                    </p>
                    <p className="inline">Images are pre-built and available on Dockerhub:</p>
                    <ul>
                        <li>
                            <a
                                href="https://hub.docker.com/r/hoangdesu/yelpcamp-mern-server"
                                target="_blank"
                            >
                                yelpcamp-mern-server
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://hub.docker.com/r/hoangdesu/yelpcamp-mern-client"
                                target="_blank"
                            >
                                yelpcamp-mern-client
                            </a>
                        </li>
                    </ul>

                    <p className="inline">Pull the images and start the container:</p>
                    <br />
                    <code>$ docker compose up -d</code>
                </div>
                <div className="mt-4">
                    <h2>Features and app preview</h2>
                    <p>
                        This app is fully responsive and mobile-friendly. Some components are
                        designed differently to work best with their current view.
                    </p>
                    <div className="overflow-x-scroll">
                        <table className="border-collapse border border-slate-500 w-full min-w-[800px]">
                            <tr className="border border-slate-500">
                                <th className="border border-slate-500 p-2 text-center">
                                    Features
                                </th>
                                <th className="border border-slate-500 p-2 text-center">
                                    Desktop view
                                </th>
                                <th className="border border-slate-500 p-2 text-center">
                                    Mobile view
                                </th>
                            </tr>
                            {[
                                {
                                    feature: 'Homepage: browse campgrounds, clustered map view',
                                    desktop: Home,
                                    mobile: HomeMob,
                                },
                                {
                                    feature:
                                        'View campground: add to favorite, leave a review, make reservations',
                                    desktop: Campground,
                                    mobile: CampgroundMob,
                                },
                                {
                                    feature:
                                        'Add new campground: location auto suggestion, images drag and drop',
                                    desktop: NewCamp,
                                    mobile: NewCampMob,
                                },
                                {
                                    feature: 'Edit or delete campground',
                                    desktop: EditCamp,
                                    mobile: EditCampMob,
                                },
                                {
                                    feature: 'Search and filtering',
                                    desktop: SearchFilter,
                                    mobile: SearchFilterMob,
                                },
                                {
                                    feature: 'Make reservation, checkout',
                                    desktop: Checkout,
                                    mobile: CheckoutMob,
                                },
                                {
                                    feature:
                                        'User dashboard: update account, manage owned and favorite campgrounds, view all reservations',
                                    desktop: User,
                                    mobile: UserMob,
                                },
                            ].map(row => (
                                <tr className="w-full">
                                    <td className="border border-slate-500 p-2">{row.feature}</td>
                                    <td className="border border-slate-500 p-2 text-center">
                                        <img
                                            src={row.desktop}
                                            alt={row.feature}
                                            className="w-full"
                                        />
                                    </td>
                                    <td className="border border-slate-500 p-2 content-center text-center">
                                        <img
                                            src={row.mobile}
                                            alt={row.feature}
                                            className="w-[90%]"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
                <div className="mt-4">
                    <h1>Demo video</h1>
                    <div className='w-full md:w-[800px]'>
                        <iframe
                            width="100%"
                            height="480"
                            src="https://www.youtube.com/embed/05fs2Pxwnj4?si=d8Efh1RSh11slaT9"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </Div>
        </PageContainer>
    );
};

export default About;
