const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(cors())

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
})

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), () => {
    console.log('====================================');
    console.log('server running on port: ' + app.get('port'));
    console.log('====================================');
})

//Seteando los middleware
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

//Constantes para las consultas a la DB
const queryShow = 'SELECT * FROM tasks'
const queryShowSpecific = 'SELECT * FROM tasks WHERE id = ?'
const queryDelete = 'DELETE FROM tasks WHERE id = ?'
const queryInsert = 'INSERT INTO tasks set ?'
const queryUpdate = 'UPDATE tasks set ? WHERE id = ?'

app.get('/', (req,res) => {
    pool.query(queryShow, (err,rows) => {
        res.send(rows)
    })
})

app.get('/:id', (req, res) => {
    pool.query(queryShowSpecific, [req.params.id], (err, rows) => {
        res.send(rows)
    })
})

app.delete('/:id', async (req,res) => {
    await pool.query(queryDelete, [req.params.id], (err, rows) => {
        res.send('deleted!')
    })
})

app.post('/', async (req, res) => {
    const { task, status } = req.body
    const newTask = {
        task,
        status
    }
    await pool.query(queryInsert, [newTask], () => {
        res.send('inserted!')
    })
})

app.put('/:id', async (req, res) => {
    const { task, status } = req.body
    const updateTask = {
        task,
        status
    }
    await pool.query(queryUpdate, [updateTask, req.params.id], () => {
        res.send('updated!')
    })
})