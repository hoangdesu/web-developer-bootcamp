const yell = function(msg) {
    try {
        console.log(msg.toUpperCase().repeat(5));
    } catch (e) {
        console.log(e); // logging errors
        console.log("Expect a string");
    }
}

yell(5);
yell("ha");