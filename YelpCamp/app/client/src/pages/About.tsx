import React from 'react';

import Container from 'react-bootstrap/Container';

import Navbar from '../components/Navbar';
import PageContainer from '../components/PageContainer';
import Footer from '../components/Footer';

const About: React.FunctionComponent = () => {
    document.title = 'YelpCamp | About';
    return (
        <PageContainer>
            <div>
                <h1 className="mb-3">About</h1>

                <p>Hi 👋</p>

                <p>I'm glad you found this page. Thanks for checking out my version of YelpCamp.</p>

                <p>
                    YelpCamp is the final project from Colt Steele's course on Udemy{' '}
                    <a href="https://www.udemy.com/course/the-web-developer-bootcamp/">
                        The Web Developer Bootcamp
                    </a>.
                </p>

                <p>
                    yelpcamp is a place for nature-lovers to come and share about their favorite
                    locations for camping.
                </p>
            </div>

            <div>
                <h2>Technologies</h2>
                <h5>Client-side</h5>
                <ul>
                    <li>React</li>
                </ul>

                <h5>Server-side</h5>
                <ul>
                    <li>Node + Express</li>
                </ul>
            </div>

            <div>
                <h2>How To</h2>
                <h3>How to add a new campground?</h3>
            </div>
        </PageContainer>
    );
};

export default About;
