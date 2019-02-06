const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true })
    .then((client) => {
        console.log(`Connected to database.`);
    })
    .catch((err) => {
        console.log(`Error Connecting: ${err}`);
    })

module.exports = {
    mongoose
}