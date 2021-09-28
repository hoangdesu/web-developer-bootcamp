const person = {
    firstName: 'Hoàng',
    lastName: 'Nguyễn',

    fullName: function() { // normal function expression
        return `${this.firstName} ${this.lastName}`; 
				// 'this' refers to the current function scope
    },

    shoutName: function() { // normal function expression
        setInterval(() => { // arrow function
            console.log(this.fullName());
				// 'this' inside arrow function
				// refers to the outer function shoutName scope
        }, 1000)
    }
}

person.shoutName();