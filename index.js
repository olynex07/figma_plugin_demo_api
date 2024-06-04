const express = require('express')
require('dotenv').config()
const cors = require("cors")
const app = express()
const port = process.env.PORT | 5000

app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.8do1nzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // collection
        const iconCollection = client.db("demoIconPlugin").collection("icons")
        app.get("/icons", async (req, res) => {
            try {
                const { type } = req.query;
                let result;
                if (type === "free" || type === "premium") {
                    // Fetch icons based on the type
                    result = await iconCollection.find({ type }).toArray();
                } else {
                    // If type is not specified or invalid, fetch all icons
                    result = await iconCollection.find().toArray();
                }
                res.json(result);
            } catch (error) {
                console.error("Error fetching icons:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });


        // get data in specific
        app.get("/icon/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await iconCollection.findOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection                                           
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Olynex icon demo')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})