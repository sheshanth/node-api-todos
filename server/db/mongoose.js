const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then((client) => {
        console.log(`Connected to database.`);
    })
    .catch((err) => {
        console.log(`Error Connecting: ${err}`);
    })

module.exports = {
    mongoose
}