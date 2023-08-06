import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useLoaderData, useNavigate } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { Button, Container } from 'react-bootstrap';
import FlashAlert from '../components/FlashAlert';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loading from './Loading';

export async function loader({ params }) {
    return { username: params.username };
}

const User = () => {
    const { username } = useLoaderData();
    const navigate = useNavigate();

    const {
        isLoading,
        error,
        data: user,
        refetch,
    } = useQuery({
        queryKey: ['userData'],
        queryFn: () => axios.get(`/api/v1/users/username/${username}`).then(res => res.data),
    });

    if (isLoading) return <Loading />;

    if (error) return <p>Error. User not found</p>;

    return (
        <PageContainer>
            <Navbar />
            <Container className="col-9 my-5">
                {/* <FlashAlert /> */}
                <p>Username: {user.username}</p>
                <p>UserId: {user._id}</p>
                <p>Email: {user.email}</p>
                <Button onClick={() => navigate(-1)}>Back</Button>
            </Container>
            <Footer />
        </PageContainer>
    );
};

export default User;
