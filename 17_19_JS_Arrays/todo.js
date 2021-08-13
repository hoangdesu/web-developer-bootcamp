const todoList = [];

console.log(`You currently have ${todoList.length} task`);

let command = prompt("What do you want to do?");

while (command !== 'quit') {
    if (command === 'add') {
        let task = prompt("Enter new task");
        todoList.push(task);
        console.log(`Added ${task} successfully!`);
    } else if (command === 'list') {
        console.log(`You currently have ${todoList.length} tasks:`);
        for (let i = 0; i < todoList.length; i++) {
            console.log(`${i+1}. ${todoList[i]}`);
        }
    } else if (command === 'delete') {
        for (let i = 0; i < todoList.length; i++) {
            console.log(`${i+1}. ${todoList[i]}`);
        }
        let task = parseInt(prompt("What task do you want to delete?"));
        if (!Number.isNaN(task) && task <= todoList.length && task > 0) {        
            let deleted = todoList.splice((task-1), 1);
            console.log(`Deleted ${deleted} successfully!`);
        } else {
            console.log("Wrong number");
        }
    }
    command = prompt("What do you want to do?");
}

console.log("Have a nice day!");