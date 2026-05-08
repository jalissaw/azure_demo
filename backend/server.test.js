import request from "supertest";
import app from "./server";

describe("GraphQL Query: getUsersById", () => {
	// Test 1: Successful Retrieval
	it("should return a user when a valid ID is provided", async () => {
		const query = {
			query: `
        query {
          getUsersById(id: "103") {
            name
            occupations
          }
        }
      `,
		};

		const response = await request(app).post("/graphql").send(query);

		const user = response.body.data.getUsersById;
		expect(user).toBeDefined();
		expect(user).toHaveProperty("name");
		expect(Array.isArray(user.occupations)).toBe(true);
	});

	// Test 2: User Not Found
	it("should return an error when the ID does not exist", async () => {
		const query = {
			query: `
        query {
          getUsersById(id: "99999") {
            name
          }
        }
      `,
		};

		const response = await request(app).post("/graphql").send(query);

		// GraphQL returns 200 even for errors, but the 'errors' array will be present
		expect(response.body.errors).toBeDefined();
		expect(response.body.errors[0].message).toBe("User not found");
		expect(response.body.data.getUsersById).toBeNull();
	});
});
