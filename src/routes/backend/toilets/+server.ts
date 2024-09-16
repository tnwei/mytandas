import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getPocketBase } from "$lib/pocketbase";


export const GET: RequestHandler = async ({url}) => {
	// In a real app, you'd fetch this data from a database or external API
	// const toilets = [
	// 	{ id: 1, name: "Central Park Restroom", lat: 40.785091, lon: -73.968285 },
	// 	{ id: 2, name: "Times Square Facilities", lat: 40.758896, lon: -73.98513 },
	// 	{
	// 		id: 3,
	// 		name: "Brooklyn Bridge Park Toilet",
	// 		lat: 40.702068,
	// 		lon: -73.996519,
	// 	},
	// ];
	// return json(toilets);
	console.log("GET called!");
	console.log(url);

	const bbox = url.searchParams.get('bbox')?.split(',').map(Number);
    const page = 1;
    const perPage = 50;

	try {
		const pb = await getPocketBase();
		let query = '';
		if (bbox && bbox.length === 4) {
		query = `lon >= ${bbox[0]} && lon <= ${bbox[2]} && lat >= ${bbox[1]} && lat <= ${bbox[3]}`;
		}
		const toilets = await pb.collection('toilets').getList(page, perPage, {filter: query});

		return json(toilets.items);
	} catch (error) {
		console.error('Error fetching toilets:', error);
		return json({ error: 'Failed to fetch toilets' }, { status: 500 });
	}
};
