- morgan middleware will run at the end, after other middlewares, to output response time
- app.use(): getting the code to run on every single request
  - must use before all route handlers to modify request object
  - or use last for 404
- res.send(): stops the whole cycle
- next(): chaining with the next middleware or route handlers.  Without calling next, it will hang up the app
- code will still run after next(), but not right away . Not a common pattern. All the middlewares will be executed first before code after calling next
-> can return next() to stop execution
- req.method = 'POST'; changing EVERY request to POST => dumbass idea, but possible

app.use: can match a particular path

to match a specific path, multiple ways: match using app.use('/path'), or pass inside app.get() as callback functions