
import { LocationInterface } from "../geo";


export interface Order {
	id: number,
	location: LocationInterface,
	features?: {}
}