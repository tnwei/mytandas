import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	// In a real app, you'd fetch this data from a database or external API
	const toilets = [
		{ id: 1, name: "Central Park Restroom", lat: 40.785091, lon: -73.968285 },
		{ id: 2, name: "Times Square Facilities", lat: 40.758896, lon: -73.98513 },
		{
			id: 3,
			name: "Brooklyn Bridge Park Toilet",
			lat: 40.702068,
			lon: -73.996519,
		},
		// Add more toilets as needed
	];

	return json(toilets);
};
