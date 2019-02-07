const express = require('express')
const bodyparser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/todo')

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

app.get('/todos', (req, res) => {
    Todo.find({})
        .then((todos) => {
            res.send({ todos })
        })
        .catch((err) => {
            res.status(400).send(err)
        })
})

app.get('/todos/:_id', (req, res) => {
    let id = req.params._id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Invalid ID.")
    }

    Todo.findById(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send("_id not found in the collection.")
            }
            res.send({ todo })
        })
        .catch((err) => {
            res.status(404).send(err)
        })
})

app.listen(3000, () => {
    console.log(`connected successfully on port 3000.`);
})

module.exports = {
    app
}