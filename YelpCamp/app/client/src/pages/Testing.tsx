import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import axios from '../config/yelpcampAxios';

const Testing = () => {
    const reader = new FileReader();

    const [selectedImages, setSelectedImages] = React.useState([]);
    const [inputStartDate, setInputStartDate] = useState('');
    const [inputEndDate, setInputEndDate] = useState('');

    // const [today, setToday] = useState(new Date().toISOString().slice(0, 10));
    const today = new Date().toISOString().slice(0, 10);

    // useEffect(() => {
    //     console.log(new Date())
    // }, []);

    const changeHandler = e => {
        // if (e.target.files && e.target.files.length > 0) {
        //     setSelectedImages(e.target.files[0]);
        // }

        const images = Array.from(e.target.files).map(f => f);
        console.log(images);
        setSelectedImages(images);
    };

    const getDays = e => {
        e.preventDefault();

        const ONE_DAY = 1000 * 60 * 60 * 24;

        // Calculate the difference in milliseconds
        const differenceMs = Math.round(new Date(inputEndDate) - new Date(inputStartDate));

        // Convert back to days and return
        const days = Math.round(differenceMs / ONE_DAY);
        console.log(days, 'days');
        console.log(inputStartDate, inputEndDate);
    };

    function onDragEnd(result) {
        console.log('result', result);
        const newItems = [...items];
        const [removed] = newItems.splice(result.source.index, 1);
        newItems.splice(result.destination.index, 0, removed);
        setItems(newItems);
    }
    const elements = [
        { id: 'one', content: 'one' },
        { id: 'two', content: 'two' },
        { id: 'three', content: 'three' },
        { id: 'four', content: 'four' },
    ];
    const [items, setItems] = useState(elements);

    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');

    const loginHandler = e => {
        e.preventDefault();

        axios
            .post(
                '/api/v1/users/login',
                {
                    username: username,
                    password: pwd,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // withCredentials: true,
                },
            )
            .then(res => {
                console.log('login ok');
                console.log(res.data);
            });
    };

    const logout = () => {
        axios
            .post(
                '/api/v1/users/logout',
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // withCredentials: true,
                },
            )
            .then(res => {
                console.log(res.data);
            });
    };

    return (
        <PageContainer>
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

            <div>
                <h1>Test date input</h1>
                <form action="">
                    <input
                        type="date"
                        min={today}
                        onChange={e => {
                            setInputStartDate(e.currentTarget?.value);
                        }}
                    />
                    <Form.Control
                        type="date"
                        min={inputStartDate}
                        onChange={e => {
                            // console.log(e.currentTarget?.value)
                            setInputEndDate(e.currentTarget?.value);
                        }}
                    ></Form.Control>
                    <button onClick={getDays}>Click</button>
                </form>
            </div>

            <div>
                <h1>Simple input for XSS</h1>
                <form action="" method="GET">
                    <input type="text" />
                    <button>Submit</button>
                </form>
            </div>

            <div>
                <h2>Test drag and drop</h2>

                {/* <DragDropContext>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((item, index) => (
                                    <Draggable draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className='bg-red-500 m-3'
                                            >
                                                <div>
                                                    {item.content}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext> */}

                {/* <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="images">
                        {provided => (
                            <div {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((el, index) => (
                                    <Draggable key={el.id} draggableId={el.id} index={index}>
                                        {provided => (
                                            <li
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className="border-black border rounded m-3 p-3"
                                            >
                                                {el.id} - {el.content}
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext> */}
            </div>

            <div>
                <h1>Test log in</h1>

                <form onSubmit={loginHandler}>
                    <label htmlFor="">Username</label>
                    <input type="text" onChange={e => setUsername(e.currentTarget.value)} />
                    <label htmlFor="">Password</label>
                    <input type="text" onChange={e => setPwd(e.currentTarget.value)} />
                    <button>Log in</button>
                </form>
                <button onClick={logout}>Log out</button>
            </div>
        </PageContainer>
    );
};

export default Testing;
