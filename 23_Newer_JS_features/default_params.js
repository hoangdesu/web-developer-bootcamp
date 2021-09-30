const rollDie = (num = 6) => { // if no param specified, num will be 6 by default 
    console.log(Math.floor(Math.random() * num) + 1);
}

rollDie();
rollDie(50);