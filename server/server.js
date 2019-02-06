const express = require('express')
const bodyparser = require('body-parser')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/todo')
const { User } = require('./model/user')

const app = express()

app.use(bodyparser.json())

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })

    todo.save()
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            res.status(400).send(err)
        });
})

app.listen(3000, () => {
    console.log(`connected successfully on port 3000.`);
})

module.exports = {
    app
}