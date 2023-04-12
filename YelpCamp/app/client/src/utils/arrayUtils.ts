export const shuffle = (arr: []): [] => {
    let randomIndex;
    for (let i = 0; i < arr.length; i++) {
        randomIndex = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = temp;
    }
    return arr;
}
