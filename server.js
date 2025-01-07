const express = require('express')
var cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require('dotenv')

dotenv.config({path: './.env'})

const dbPassword = process.env.DB_PASSWORD 
const port = process.env.PORT
  

mongoose.connect(`mongodb+srv://annan:${dbPassword}@main.uu4y6.mongodb.net/?retryWrites=true&w=majority&appName=main`)
.then(res =>{
  console.log("DB connect successfully")
}).catch(err => {
  console.log("DB connection failed")
})


const app = express()

const TaskSchema = new mongoose.Schema({
  task: String,
  isCompleted: Boolean
});

const Task = mongoose.model('task', TaskSchema);


app.use(cors({
  origin: 'http://localhost:5173',
}))

app.use(express.json())

app.use((req, res, next)=>{
  console.log("Working")
  next()
})


app.get("/", (req, res)=>{
  Task.find()
  .then(taskItems =>{
    console.log(taskItems)
    res.json({taskItems, count: taskItems.length})
  })
  .catch(err => {

  })
})

app.post("/", (req, res)=>{
  console.log(req.body)
  const usertask = req.body.task
  Task.create({task: usertask})
  res.send("Success")
})


app.delete("/task/:id", (req, res) =>{
  Task.findByIdAndDelete(req.params.id)
  .then(data =>{
    if(data){
      res.send("Deleted")
    }
    else{
      res.status(404).json({"message": "Task does not exist"})
    }
  })
  .catch(err =>{
    console.log(err)
    res.status(400).json({"message": "Something went wrong"})
  })
})


app.put("/task/:id", (req, res) => {
  const id = req.params.id
  const updatedTask = req.body
  Task.findByIdAndUpdate(id, updatedTask)
  .then(data =>{
    if(data){
      res.send("Task updated successfully")
    }
    else{
      res.status(404).json({"message": "Task does not exist"})
    }
  })
  .catch(err =>{
    console.log(err)
    res.status(400).json({message: "Something went wrong"})
  })

})  

app.listen(port, ()=>{
  console.log("Server Started on port 4000")
})