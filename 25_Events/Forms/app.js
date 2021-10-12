const form = document.querySelector('#commentForm');
const comments = document.querySelector('#comments');
const noCmt = document.querySelector('#nocomment');

form.addEventListener('submit', function (evt) {
    evt.preventDefault();   // prevent submitting the form
    
    // getting elements
    const username = form.elements.username.value;  // access elements' values directly from form
    const comment = this.elements.comment.value;  // access elements' values directly from form
    const btn = this.elements[2]; // using elements collection - btn object
    // console.log(username);
    // console.log(comment);
    // console.log(btn.innerHTML);
    
    // creating new elements
    // template: <li>(time) - <b>username</b>: "comment"</li>
    const li = document.createElement('li');
    const bTag = document.createElement('b');

    const date = new Date();
    li.append(`(${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}) `)
    bTag.append(username);
    li.append(bTag);
    li.append(`: "${comment}"`);

    noCmt.style.display = 'none';
    
    // append to ul
    comments.append(li);

    // clear input values
    form.elements.username.value = '';
    form.elements.comment.value = '';

    console.log(li);
})