const p1Score = document.querySelector('#p1');
const p2Score = document.querySelector('#p2');
const select = document.querySelector('#scoresSelect');
const btnP1Score = document.querySelector('#btnP1Score');
const btnP2Score = document.querySelector('#btnP2Score');
const btnReset = document.querySelector('#btnReset');

const updateScore = (player) => {
    let score = parseInt(player.innerText);
    let limit = parseInt(select.value);
    score++;
    if (score >= limit) {
        btnP1Score.disabled = true;
        btnP2Score.disabled = true;
        // console.log(btn);

        // changing colors on win condition
        if (player.id === 'p1') {
            player.style.color = 'green';
            p2Score.style.color = 'red';
        } else {
            player.style.color = 'green';
            p1Score.style.color = 'red'; 
        }
    }
    player.innerText = score;
    // console.log(score, select.value);
    // console.dir(player);
}

btnP1Score.addEventListener('click', function ()  {
    updateScore(p1Score);
});

btnP2Score.addEventListener('click', function () {
    updateScore(p2Score);
});

const reset = () => {
    btnP1Score.disabled = false;
    btnP2Score.disabled = false;
    p1Score.innerText = '0';
    p2Score.innerText = '0';
    p1Score.style.color = 'black';
    p2Score.style.color = 'black';
}

btnReset.addEventListener('click', reset);

// another way of executing reset()
select.addEventListener('change', () => {
    reset();
})
