import { buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import { ruruHTML } from "ruru/server";
import { users } from "./users.js";
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const corsOptions = {
	origin: ["https://backend.calmflower-4d343499.westus2.azurecontainerapps.io", "https://frontend.calmflower-4d343499.westus2.azurecontainerapps.io", "http://localhost:5173", "http://localhost:3000"],
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	accessControlAllowOrigin: "*",
	accessControlAllowCredentials: true,
};

const app = express();
const uri = 'mongodb://root:mongopw@mongo:27017';
const client = new MongoClient(uri);
// Construct a schema, using GraphQL schema language

// Connect to the DB once when the server starts
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
    } catch (e) {
        console.error("Connection to MongoDB failed", e);
    }
}
connectDB();

// Read the schema from your actual file
const schemaPath = path.join(process.cwd(), "graphql", "schema.graphql");
const schemaSource = fs.readFileSync(schemaPath, "utf8");

const schema = buildSchema(schemaSource);


// The root provides a resolver function for each API endpoint
const root = {
	async users() {

		try {
			const database = client.db('users')
			const collection = await database.collection('user').find({}).toArray();

			if (!collection) {
				throw new Error("Unable to connect")
			}
		
			const update_id_collections = collection.map((col) => ({
				...col, 
				id: col._id
			}))

			return update_id_collections || users;

		} catch (err) {
			console.log(err)
		}
	
	},

	getUsersById({ id }) {
		const user = users.find((user) => user.id === id);
		if (!user) {
			throw new Error("User not found");
		}
		return users.find((user) => user.id === id);
	},

	
		addUser: async ({input}) => {
			
			const { name, age, occupations } = input
			let newUser = {name, age, occupations}
			
			try {
			  const database = client.db('users');
			  const collection = database.collection('user');
			  newUser = await collection.insertOne(newUser)
			
			} finally {
			  await client.close();
			}
			
			return {
			  ...newUser,
			  id: newUser._id 
			};
		  }

	
		
	  
};


// Create and use the GraphQL handler.
app.use(express.json());
app.use(cors(corsOptions));
app.use(
	"/graphql",
	createHandler({
		schema: schema,
		rootValue: root,
	})
);

// Serve the GraphiQL IDE.
app.get("/", (_req, res) => {
	res.type("html");
	res.end(ruruHTML({ endpoint: "/graphql" }));
});

// Start the server at port
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
