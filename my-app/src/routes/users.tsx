import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/users")({
	component: RouteComponent,
});

function RouteComponent() {
	console.log(import.meta.env, "NEW TO ME");
	const { data, isLoading } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			//put the url in as an env variable
			const res = await fetch(
				"https://backend.calmflower-4d343499.westus2.azurecontainerapps.io/graphql",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					// make own graphql query
					body: JSON.stringify({ query: "{ users { name, age, id } }" }),
				}
			);

			return res.json();
		},
	});

	if (isLoading) return <>Loading...</>;
	// make own types
	return (
		<div>
			{data?.data?.users?.map((user) => {
				return (
					<h1 key={user.id}>
						{user.name} - {user.age}
					</h1>
				);
			})}
		</div>
	);
}
