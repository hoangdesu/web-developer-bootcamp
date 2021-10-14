// series
// setTimeout(() => {
//     document.body.style.backgroundColor = 'red';    
// }, 1000);

// setTimeout(() => {
//     document.body.style.backgroundColor = 'green';    
// }, 2000);

// setTimeout(() => {
//     document.body.style.backgroundColor = 'blue';    
// }, 3000);


// nested. yuck!! outside -> inside
// setTimeout(() => {
//     document.body.style.backgroundColor = 'red';
//     setTimeout(() => {
//         document.body.style.backgroundColor = 'green';
//         setTimeout(() => {
//             document.body.style.backgroundColor = 'blue';
//         }, 1000);
//     }, 1000);
// }, 1000);


// make it function rather
const changeBodyColor = (color, delay, doNext) => {
    setTimeout(() => {
        document.body.style.backgroundColor = color;
        const h1 = document.createElement('h1');
        h1.innerText = `Current color: ${color}`;
        document.body.append(h1);
        doNext && doNext(); // if has doNext, execute it
    }, delay)
} 

changeBodyColor('red', 1000, () => {
    changeBodyColor('green', 1000, () => {
        changeBodyColor('blue', 1000, () => {
            changeBodyColor('yellow', 1000, () => {
                changeBodyColor('purple', 1000, () => {
                    changeBodyColor('pink', 1000, () => {
                        changeBodyColor('purple', 1000, () => {
                            changeBodyColor('navy', 1000, () => {
                                changeBodyColor('orange', 1000)
                            })
                        })
                    })
                })
            })
        })
    })
});