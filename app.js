const express = require("serverless-express/express")
const app = express()
const { Pool } = require("pg")
require("dotenv").config({ path: "../.env.local" })
const cors = require("cors")

const pool = new Pool({
    user: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

app.use(express.json())
app.use(cors())

//add a todo
app.post("/todos", async (req, res) => {
    const { description } = req.body
    try {
        const postTodo = await pool.query("INSERT INTO todos (description) VALUES($1) RETURNING *;", [description])
        await res.json(postTodo)
    } catch (err) {
        console.error(err)
    }
})

//get a todo
app.get("/todos/:id", async (req, res) => {
    const { id } = req.params
    try {
        const getTodo = await pool.query("SELECT * FROM todos WHERE tid = $1;", [id])
        await res.json(getTodo.rows)
    } catch (err) {
        console.error(err)
    }

})

//get all todos
app.get("/todos", async (req, res) => {
    try {
        const getAllTodos = await pool.query("SELECT * FROM todos;")
        await res.json(getAllTodos.rows)
    } catch (err) {
        console.error(err)
    }
})

//delete todo
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params
    try {
        const deleteTodo = await pool.query("DELETE FROM todos WHERE tid = $1 RETURNING *", [id])
        res.json(deleteTodo.rows)
    } catch (err) {
        console.error(err)
    }
})

//update todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params
    const { description } = req.body

    try {
            const updateTodo = await pool.query("UPDATE todos SET description = $2 WHERE tid = $1 RETURNING *;", [id, description])
            res.json(updateTodo.rows)


    } catch (err) {
        console.error(err)
    }
})

module.exports = app