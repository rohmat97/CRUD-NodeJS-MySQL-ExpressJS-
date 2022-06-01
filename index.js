const mysql = require('mysql')
const express = require('express')

let app = express()
const bodyparser = require('body-parser')

app.use(bodyparser.json())

let mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'dasuki97',
    database: 'employeedb',
    multipleStatements:true
})

mysqlConnection.connect((err) =>{
    if(!err){
        console.log('CONNECTION DB SUCCESS');
    }else{
        console.log('DB CONNECTION FAILED', JSON.stringify(err, undefiend,2));
    }
})

app.listen(5000, () => {
    console.log('App listening on port 5000!');
});

app.get('/', (req, res) => {
    res.send('<p>HOME PAGE</p>');
});

// get all employees
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields)=>{
        if(!err){
            console.log(rows[0].EmpID);
            res.send(rows)
        } else {
            console.log(err);
        }
    })
});

// get an employess

app.get('/employees/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee WHERE EmpID = ?',[req.params.id], (err, rows, fields)=>{
        if(!err){  
            res.send(rows)
        } else {
            console.log(err);
        }
    })
});

// Delete an employees

app.delete('/employees/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM employee WHERE EmpID = ?',[req.params.id], (err, rows, fields)=>{
        if(!err){
            // res.send(rows)
            rows.forEach(element => {
                if(element.constructor === Array){
                   res.send('Inserted employee id: ',element[0].EmpID)
                }
            });
        } else {
            console.log(err);
        }
    })
});

// Insert an employees

app.post('/employees', (req, res) => {
    const emp = req.body
    const sql = "SET @EmpID=?; SET @Name =?; SET @EmpCode =?; SET @Salary= ?;\
                 CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields)=>{
        if(!err){
            res.send(rows)
        } else {
            console.log(err);
        }
    })
});

// Update an employees

app.put('/employees', (req, res) => {
    const emp = req.body
    const sql = "SET @EmpID=?; SET @Name =?; SET @EmpCode =?; SET @Salary= ?;\
                 CALL EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);"
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary], (err, rows, fields)=>{
        if(!err){
            res.send('Updated successfully')
        } else {
            console.log(err);
        }
    })
});