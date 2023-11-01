import React, { useState, useRef, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import axios from '../config/yelpcampAxios';

import AppContext from '../store/app-context';

import { Container, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material/';

import Footer from '../components/Footer';
import PageContainer from '../components/PageContainer';
import RegisterBG from '../assets/register-bg.jpeg';
import Logo from '../assets/logo.png';
import PrimaryBlackButton from '../components/Buttons/PrimaryBlackButton';
import PageSnackbar from '../components/PageSnackbar';

const InputGroupText = styled(InputGroup.Text)`
    &:hover {
        cursor: pointer;
        background-color: #eff3f6b7;
    }
`;

const Div = styled.div<{ mouseCoords: { x: number; y: number } }>`
    width: 100vw;
    height: 100vh;

    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2)),
        /* url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c8TV1mAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpWWB67c2BUFb3g557T/hRo9/WUMZHlgr4Bg8Z4qQgQJlHI4A8SzFVrapvmTF9O7dmYRFZ60YiBhJRCgh1FYhiLAmdvX0CzTOpNE77ME0Zty/nWWzchDtiqrmQDeuv3powQ5ta2eN0FY0InkqDD73lT9c9lEzwUNqgFHs9VQce3TVClFCQrSTfOiYkVJQBmpbq2L6iZavPnAPcoU0dSw0SUTqz/GtrGuXfbyyBniKykOWQWGqwwMA7QiYAxi+IlPdqo+hYHnUt5ZPfnsHJyNiDtnpJyayNBkF6cWoYGAMY92U2hXHF/C1M8uP/ZtYdiuj26UdAdQQSXQErwSOMzt/XWRWAz5GuSBIkwG1H3FabJ2OsUOUhGC6tK4EMtJO0ttC6IBD3kM0ve0tJwMdSfjZo+EEISaeTr9P3wYrGjXqyC1krcKdhMpxEnt5JetoulscpyzhXN5FRpuPHvbeQaKxFAEB6EN+cYN6xD7RYGpXpNndMmZgM5Dcs3YSNFDHUo2LGfZuukSWyUYirJAdYbF3MfqEKmjM+I2EfhA94iG3L7uKrR+GdWD73ydlIB+6hgref1QTlmgmbM3/LeX5GI1Ux1RWpgxpLuZ2+I+IjzZ8wqE4nilvQdkUdfhzI5QDWy+kw5Wgg2pGpeEVeCCA7b85BO3F9DzxB3cdqvBzWcmzbyMiqhzuYqtHRVG2y4x+KOlnyqla8AoWWpuBoYRxzXrfKuILl6SfiWCbjxoZJUaCBj1CjH7GIaDbc9kqBY3W/Rgjda1iqQcOJu2WW+76pZC9QG7M00dffe9hNnseupFL53r8F7YHSwJWUKP2q+k7RdsxyOB11n0xtOvnW4irMMFNV4H0uqwS5ExsmP9AxbDTc9JwgneAT5vTiUSm1E7BSflSt3bfa1tv8Di3R8n3Af7MNWzs49hmauE2wP+ttrq+AsWpFG2awvsuOqbipWHgtuvuaAE+A1Z/7gC9hesnr+7wqCwG8c5yAg3AL1fm8T9AZtp/bbJGwl1pNrE7RuOX7PeMRUERVaPpEs+yqeoSmuOlokqw49pgomjLeh7icHNlG19yjs6XXOMedYm5xH2YxpV2tc0Ro2jJfxC50ApuxGob7lMsxfTbeUv07TyYxpeLucEH1gNd4IKH2LAg5TdVhlCafZvpskfncCfx8pOhJzd76bJWeYFnFciwcYfubRc12Ip/ppIhA1/mSZ/RxjFDrJC5xifFjJpY2Xl5zXdguFqYyTR1zSp1Y9p+tktDYYSNflcxI0iyO4TPBdlRcpeqjK/piF5bklq77VSEaA+z8qmJTFzIWiitbnzR794USKBUaT0NTEsVjZqLaFVqJoPN9ODG70IPbfBHKK+/q/AWR0tJzYHRULOa4MP+W/HfGadZUbfw177G7j/OGbIs8TahLyynl4X4RinF793Oz+BU0saXtUHrVBFT/DnA3ctNPoGbs4hRIjTok8i+algT1lTHi4SxFvONKNrgQFAq2/gFnWMXgwffgYMJpiKYkmW3tTg3ZQ9Jq+f8XN+A5eeUKHWvJWJ2sgJ1Sop+wwhqFVijqWaJhwtD8MNlSBeWNNWTa5Z5kPZw5+LbVT99wqTdx29lMUH4OIG/D86ruKEauBjvH5xy6um/Sfj7ei6UUVk4AIl3MyD4MSSTOFgSwsH/QJWaQ5as7ZcmgBZkzjjU1UrQ74ci1gWBCSGHtuV1H2mhSnO3Wp/3fEV5a+4wz//6qy8JxjZsmxxy5+4w9CDNJY09T072iKG0EnOS0arEYgXqYnXcYHwjTtUNAcMelOd4xpkoqiTYICWFq0JSiPfPDQdnt+4/wuqcXY47QILbgAAAABJRU5ErkJggg==), */
            url(${RegisterBG});
    /* url(data:image/jpeg;base64,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); */
    /* url(https://sondoongcave.info/wp-content/uploads/2022/03/doi-nhau.jpg); */
    /* url(https://oxalisadventure.com/uploads/2022/11/1-1500x1000__638041903069417369.jpg); */
    /* url(https://oxalisadventure.com/uploads/2022/11/5-1500x1000__638041898532582085.jpg); */
    /* background-image: url(https://images.unsplash.com/photo-1504457047772-27faf1c00561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2147&q=80); */

    /* background-color: ${props => (props.mouseCoords.x > 750 ? '100vh' : '50vh')}; */

    /* background-position: 50% 100%; */
    background-position: ${props => props.mouseCoords.x / 50}%
        calc(80% + ${props => props.mouseCoords.y / 100}%);
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s all ease;

    .login-box {
        background-color: white;
        border-radius: 12px;
        width: 450px;
        min-height: fit-content;
        padding: 3rem;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 8px 16px;
        /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1); */
        box-sizing: border-box;
        margin-right: 40%;
        /* margin-bottom: 5%; */

        @media screen and (max-width: 992px) {
            margin: 20px;
            margin-bottom: 100px;
        }
    }

    .hover-underline-animation {
        display: inline-block;
        position: relative;
    }

    .hover-underline-animation:after {
        content: '';
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: var(--primary-dark-color);
        transform-origin: bottom right;
        transition: transform 0.25s ease-out;
    }

    .hover-underline-animation:hover:after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

const Register: React.FunctionComponent = () => {
    const [validated, setValidated] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate();
    const appContext = useContext(AppContext);
    const [isRegistering, setIsRegistering] = useState(false);

    const formUsername = useRef<HTMLInputElement>(null);
    const formEmail = useRef<HTMLInputElement>(null);
    const formPassword = useRef<HTMLInputElement>(null);

    const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        document.title = 'YelpCamp | Register';
        const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
        if (currentUser) {
            appContext.setAlert({
                message: `You're already logged in as ${currentUser.username}`,
                variant: 'success',
            });
            navigate('/');
        }

        // for moving background effect
        const handleWindowMouseMove = event => {
            setMouseCoords({
                x: event.clientX,
                y: event.clientY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setIsRegistering(true);
            axios
                .post(
                    '/api/v1/users',
                    {
                        username: formUsername.current?.value || '',
                        email: formEmail.current?.value || '',
                        password: formPassword.current?.value || '',
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )
                .then(res => {
                    axios.get('/api/v1/auth/currentuser').then(resp => {
                        appContext.setCurrentUser(resp.data);
                        localStorage.setItem('currentUser', JSON.stringify(resp.data));
                        appContext.setAlert({
                            message: `Welcome to YelpCamp, ${resp.data.username}!`,
                            variant: 'success',
                        });
                        navigate(`/`);
                    });
                })
                .catch(err => {
                    appContext.setSnackbar(true, err.response?.data?.message, 'error');
                    setValidated(false);
                    form.reset();
                    setIsRegistering(false);
                });
        }
        setValidated(true);
    };

    return (
        <Div mouseCoords={mouseCoords}>
            <div className="login-box">
                {/* <h1 className="text-center mb-4">Welcome to</h1> */}
                <Link to="/" className="block text-inherit no-underline hover:text-black">
                    <div className="w-full flex flex-row items-center justify-center gap-2">
                        <img src={Logo} alt="yelpcamp-logo" className="w-[60px]" />
                        <h2 className="text-center hover-underline-animation">YelpCamp</h2>
                    </div>
                </Link>

                <p className="text-center my-4">Welcome to YelpCamp!</p>

                <Form className="mb-5" noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" ref={formUsername} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Username is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text" ref={formEmail} required />
                        <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">
                            Email is required!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup className="mb-2">
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                ref={formPassword}
                                required
                            />
                            <InputGroupText onClick={() => setShowPassword(show => !show)}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </InputGroupText>
                            <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">
                                Password is required!
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>

                    {isRegistering ? (
                        <PrimaryBlackButton className="my-4 w-full" disabled={true}>
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                as="span"
                            />
                            <span> Creating your account...</span>
                        </PrimaryBlackButton>
                    ) : (
                        <PrimaryBlackButton className="my-4 w-full">Register</PrimaryBlackButton>
                    )}
                </Form>
                <p className="my-3">
                    Have an account?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-800">
                        Login
                    </Link>{' '}
                </p>
            </div>
            <PageSnackbar />
        </Div>
    );
};

export default Register;
