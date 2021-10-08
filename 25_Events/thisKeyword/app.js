for (let i = 0; i < 50; i++) {
    const btn = document.createElement('button');
    btn.innerText = 'Button ' + (i+1);
    document.body.appendChild(btn);
}

const buttons = document.querySelectorAll('button');

const getRandColor = () => {
    let s = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        let randIndex = Math.floor(Math.random() * s.length);
        color += s[randIndex];
    }
    return color;
}

const changeText = function() {
    this.innerText = 'Clicked!';
    this.disabled = true;
}

let counter = 0;

for (let btn of buttons) {
    btn.addEventListener('click', function() {
        let bgColor = getRandColor();
        btn.style.backgroundColor = bgColor;
        console.log(this);
        console.log(bgColor);
        let textColor = getRandColor();
        this.style.color = textColor; // exactly the same as btn.style.color
        console.log(textColor);
        counter++;
        if (counter === buttons.length) {
            document.querySelector('h1').innerText = "VOILÀ! YOU JUST WASTED 1 MINUTE OF YOUR LIFE =))";
        }
    })

    // using 'this' keyword to access button object being listened to
    btn.addEventListener('click', changeText)
}

