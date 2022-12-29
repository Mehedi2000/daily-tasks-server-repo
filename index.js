const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 8000;

//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dpvinfz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const dailyTasksCollection = client.db("tasks").collection("dailyTasks");
    const addTasksCollection = client.db("tasks").collection("addTasks");

    app.get("/addTask", async (req, res) => {
      const query = {};
      const tasks = await addTasksCollection.find(query).toArray();
      res.send(tasks);
    });

    app.get("/tasks", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const tasks = await dailyTasksCollection.find(query).toArray();
      res.send(tasks);
    });

    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await dailyTasksCollection.findOne(query);
      res.send(user);
    });

    app.post("/tasks", async (req, res) => {
      const task = req.body;

      const result = await dailyTasksCollection.insertOne(task);
      res.send(result);
    });

    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const task = req.body;
      console.log(task);
      const option = { upsert: true };
      const updateTask = {
        $set: {
          task: task.task,
        },
      };
      const result = await dailyTasksCollection.updateOne(
        filter,
        updateTask,
        option
      );
      res.send(result);
    });

    app.post("/addTask", async (req, res) => {
      const product = req.body;
      const result = await addTasksCollection.insertOne(product);
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await dailyTasksCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Daily Tasks server is running");
});

app.listen(port, () => console.log(`Daily Tasks running on ${port}`));
