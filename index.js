const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const app = express();
const port = process.env.port || 5000;

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efkktro.mongodb.net/myDatabase?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch(err => {
    console.error("Connection Failed: ", err.message);
  });


// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://portfolio-of-mahfuz-99.surge.sh",
      // "https://mahfuz-s-personal-projects.web.app",
      // "https://mahfuz-s-portfolio-website.vercel.app"
    ],
  })
);
app.use(express.json());
app.use(morgan("dev"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efkktro.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    //   Create collections
    const projectsCollection = client
      .db("MahfuzPortfolio")
      .collection("projects");
    const credentialsCollection = client
      .db("MahfuzPortfolio")
      .collection("credentials");

    // add credentials post
    app.post("/credentials", async (req, res) => {
      try {
        const credentialsItem = req.body;
        const result = await credentialsCollection.insertOne(credentialsItem);
        res.send(result);
      } catch (error) {
        console.error("Error inserting credentials:", error);
        res.status(500).send("Failed to add credentials");
      }
    });

    // get credentials
    app.get("/credentials", async (req, res) => {
      try {
        const result = await credentialsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });
    // update credential
    app.patch("/credentials/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updatesCredentials = req.body;
        console.log(updatesCredentials);
        const product = {
          $set: {
            credential_Name: updatesCredentials.credential_Name,
            credential_Email: updatesCredentials.credential_Email,
            credential_phone: updatesCredentials.credential_phone,
            credential_Screen_Shot: updatesCredentials.credential_Screen_Shot,
            credential_Password: updatesCredentials.credential_Password,
          },
        };
        const result = await credentialsCollection.updateOne(filter, product);
        res.send(result);
        if (result.modifiedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Project updated successfully" });
        } else {
          res.status(404).json({
            success: false,
            message: "Project not found or not modified",
          });
        }
      } catch (error) {
        res.send(error);
      }
    });
    // Deleting credential data
    app.delete("/credentials/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await credentialsCollection.deleteOne(query);
        console.log(query, result);
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    // add project post
    app.post("/projects", async (req, res) => {
      try {
        const projectItem = req.body;
        const result = await projectsCollection.insertOne(projectItem);
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });
    // project get all
    app.get("/projects", async (req, res) => {
      try {
        const result = await projectsCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });
    // project get specific id
    app.get("/projects/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await projectsCollection.findOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });
    // update project
    app.patch("/projects/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: new ObjectId(id) };
        const updatesProject = req.body;
        console.log(updatesProject);
        const product = {
          $set: {
            projectName: updatesProject.projectName,
            full_Screen_Shot: updatesProject.full_Screen_Shot,
            Short_Screen_Shot: updatesProject.Short_Screen_Shot,
            Live_Link: updatesProject.Live_Link,
            GitHub_Client_Side_Link: updatesProject.GitHub_Client_Side_Link,
            GitHub_Server_Side_Link: updatesProject.GitHub_Server_Side_Link,
            category: updatesProject.category,
          },
        };
        const result = await projectsCollection.updateOne(filter, product);
        res.send(result);
        if (result.modifiedCount > 0) {
          res
            .status(200)
            .json({ success: true, message: "Project updated successfully" });
        } else {
          res.status(404).json({
            success: false,
            message: "Project not found or not modified",
          });
        }
      } catch (error) {
        res.send(error);
      }
    });
    // Deleting project data
    app.delete("/projects/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const result = await projectsCollection.deleteOne(query);
        console.log(query, result);
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});
