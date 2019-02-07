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
        text: "Second test todo",
        completed: true,
        completedAt: 333
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

describe('DELETE /todos/:_id', () => {
    it('should delete a todo ', (done) => {
        request(app)
        .delete(`/todos/${todos[0]._id}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })    
    it('should return 404 if invalid id', (done) => {
        request(app)
        .delete(`/todos/123asd`)
        .expect(404)
        .end(done)
    })
    it('should return 404 on no document in collection', (done) => {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done)
    })
})

describe('PATCH /todos/:_id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id.toHexString()
        let text = "This should be the new text"

        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: true
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(typeof res.body.todo.completedAt).toBe('number')
        })
        .end(done)

    })
    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id.toHexString()
        let text = "This should be the new text"

        request(app)
        .patch(`/todos/${id}`)
        .send({
            text,
            completed: false
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toBeNull()
        })
        .end(done)

    })
})