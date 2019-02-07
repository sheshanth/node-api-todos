const express = require('express')
const bodyparser = require('body-parser')
const { ObjectID } = require('mongodb')
const _ = require('lodash')

const { mongoose } = require('./db/mongoose')
const { Todo } = require('./model/todo')

const port = process.env.PORT || 3000
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

app.delete('/todos/:_id', (req, res) => {
    let id = req.params._id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid _id')
    }

    Todo.findByIdAndDelete(id)
        .then((todo) => {
            if (!todo) {
                return res.status(404).send("delete document not found in collection")
            }
            res.send({ todo })
        })
        .catch((err) => {
            res.status(404).send('document not found')
        })
})


app.patch('/todos/:_id', (req, res) => {
    let id = req.params._id
    let body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('Invalid _id')
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    }
    else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then((todo) => {
        if(!todo) {
            return res.status(400).send()
        }
        res.send({todo})
    })
    .catch((err) => {
        res.status(404).send()
    })
})

app.listen(port, () => {
    console.log(`connected successfully on port ${port}.`);
})

module.exports = {
    app
}