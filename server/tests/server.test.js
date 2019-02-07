const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('../server')
const { Todo } = require('../model/todo')

const todos = [
    {
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo"
    }
]

beforeEach((done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done())
})


describe("POST /todos", () => {
    it("should create a new todo", (done) => {
        let text = "test todo text"

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(1)
                        expect(todos[0].text).toBe(text)
                        done()
                    })
                    .catch((err) => {
                        done(e)
                    })
            })
    })

    it('sholud not create a todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2)
                        done()
                    })
                    .catch((err) => done(err))
            })
    })
})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:_id', () => {
    it('should get the particular todo of specified _id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should a return a 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString()
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123asd`)
        .expect(404)
        .end(done)
    })

})