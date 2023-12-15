import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const IconsContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 8px;
    align-items: center;
    gap: 8px;

    a {
        font-size: 1.5em;
        color: gray;
        transition: all 0.2s ease;
        border: 1px solid gray;
        width: 1.5em;
        height: 1.5em;
        text-align: center;
        border-radius: 6px;
    }

    a i {
        transition: all 0.7s ease;
        perspective: 1000px;
    }

    a:hover {
        color: white;
        border: 1px solid white;
    }

    a:hover i {
        transform: rotateY(360deg);
    }
`;

const Footer: React.FunctionComponent = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer className="footer bg-dark fixed bottom-0 w-full z-[-1] py-4">
            <Container className="px-[5%] text-gray-400 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 place-items-center md:grid-cols-3">
                    <div className="flex flex-col items-center md:items-start md:h-full">
                        <h5 className="text-primary-color inline">YelpCamp</h5>
                        <div className="text-sm">(TypeScript MERN stack)</div>
                        <Link
                            to="/about"
                            className="nav-link underline mt-2 underline-offset-4 hover:text-primary-color inline-block"
                        >
                            About
                        </Link>
                    </div>
                    <div className="flex flex-col items-center md:items-start md:h-full">
                        <h5 className="text-primary-color inline">Connect</h5>
                        <IconsContainer>
                            <Tooltip title="Github" placement="top">
                                <a
                                    href="https://github.com/hoangdesu/web-developer-bootcamp/tree/master/YelpCamp"
                                    target="_blank"
                                >
                                    <i className="fa-brands fa-github"></i>
                                </a>
                            </Tooltip>
                            <Tooltip title="LinkedIn" placement="top">
                                <a href="https://www.linkedin.com/in/hoangdesu/" target="_blank">
                                    <i className="fa-brands fa-linkedin"></i>
                                </a>
                            </Tooltip>
                            <Tooltip title="Personal website" placement="top">
                                <a href="https://hoangdesu.com/" target="_blank">
                                    <i className="fa-solid fa-globe"></i>
                                </a>
                            </Tooltip>
                            <Tooltip title="Facebook" placement="top">
                                <a href="https://www.facebook.com/Hoangdayo" target="_blank">
                                    <i className="fa-brands fa-facebook-f"></i>
                                </a>
                            </Tooltip>
                            <Tooltip title="X / Twitter" placement="top">
                                <a href="https://twitter.com/hoangdesu" target="_blank">
                                    <i className="fa-brands fa-x-twitter"></i>
                                </a>
                            </Tooltip>
                            <Tooltip title="Instagram" placement="top">
                                <a href="https://www.instagram.com/hoang.desu/" target="_blank">
                                    <i className="fa-brands fa-instagram"></i>
                                </a>
                            </Tooltip>
                        </IconsContainer>
                    </div>
                    <div className="flex flex-col items-center md:items-start md:h-full">
                        <button
                            className="nav-link hover:text-white flex flex-row items-center gap-1 mb-3"
                            onClick={scrollToTop}
                        >
                            <KeyboardArrowUpIcon />
                            <span>Back to top</span>
                        </button>
                        <span className="text-gray-400 text-xs">Build: {__BUILD_TIMESTAMP__}</span>
                    </div>
                </div>
                <div className="text-gray-300 text-center mt-auto text-sm">
                    &copy; {new Date().getFullYear()} Hoang Nguyen. All Rights Reserved.
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
