
import { LocationInterface } from "../geo";


export interface AmqpOrder {
	id: number,
	location: LocationInterface,
	features?: {}
}