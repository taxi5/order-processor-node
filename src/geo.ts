

export interface LocationInterface {
	longitude: number,
	latitude: number,
	accuracy?: number
}

export function getRandomLocation() {
	const location: LocationInterface = {
		latitude: Math.random() * (53.972167 - 53.828164) + 53.828164,
		longitude: Math.random() * (27.719198 - 27.400352) + 27.400352
	}
	return location;
}