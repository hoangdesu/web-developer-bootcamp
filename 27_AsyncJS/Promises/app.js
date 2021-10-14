new Promise((resolve, reject) => {
    resolve();
    // reject();
});

const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        const rand = Math.random();
        setTimeout(() => {
            if (rand < 0.6) {
                resolve('Data fetched!');
            }
            reject('Request error');
        }, 1000);
    })
}

// const request = fakeRequest();

// console.log('Before:', request);

// setTimeout(() => {
//     console.log('After:', request);
// }, 1005)


fakeRequest('hi')
    .then((data) => {
        console.log('Request Done!');
        console.log('Data is:', data);
    })
    .catch((err) => {
        console.log('Error: ' + err);
    });



// SUPER DUPER IMPORTANT PART!!

const changeBodyColor = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            console.log('Color changed to: ' + color);
            resolve(color); // to indicate this promise has been resolved
        }, delay);
        // reject('Failed to change color'); ---> don't reject, otherwise it will not work!!
    })
}

changeBodyColor('red', 1000)
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br><br>Current color: ${data}`;
        return changeBodyColor('green', 1000); // make sure to return for next .then()
    })
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
        return changeBodyColor('blue', 1000);
    })
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
        return changeBodyColor('yellow', 1000);
    })
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
        return changeBodyColor('pink', 1000);
    })
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
        return changeBodyColor('purple', 1000);
    })
    .then((data) => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
        return changeBodyColor('brown', 1000);
    })
    .then(data => {
        document.querySelector('h1').innerHTML += `<br>Current color: ${data}`;
    })
    .catch(() => {
        console.log('Failed to change color :(');
    });
