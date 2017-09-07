/**
 * OSRM Client service
 *
 * Created by omez on 25.07.17.
 */

import * as url from "url";
import * as request from "request";
import * as debug from "debug";

export namespace io {

	export type ServiceType = "route" | "nearest" | "table" | "match" | "trip" | "tile";
	export type CodeType =
		"Ok"
		| "InvalidUrl"
		| "InvalidService"
		| "InvalidVersion"
		| "InvalidOptions"
		| "InvalidQuery"
		| "InvalidValue"
		| "NoSegment"
		| "TooBig";

	export interface LocationObjectInterface {
		lat: number,
		long: number
	}

	export interface LocationObjectLongInterface {
		latitude: number,
		longitude: number
	}

	export type LocationType = [number, number] | LocationObjectInterface | LocationObjectLongInterface;
	export type ApproachType = "curb" | "unrestricted";

	export interface RequestParamsInterface {
		service: ServiceType,
		version: number,
		profile: string,
		coordinates: LocationType | LocationType[]
		format?: "json"
	}

	export interface RequestOptionsInterface {
		generate_hints?: boolean,
		radiuses?: number | number[],
		hints?: string | string[],
		approaches?: ApproachType | ApproachType[]
	}

	export interface ResponseInterface {
		code: CodeType | string, // additional codes may be applied
		message?: string
	}

	export class Client {

		private readonly baseUri;
		private readonly logger: debug.Debugger;

		public constructor(baseUri: string) {
			this.baseUri = baseUri; // TODO trim trailing slash
			this.logger = debug('osrm:client');
		}

		public request<T>(params: RequestParamsInterface, options?: RequestOptionsInterface): Promise<T> {

			// create request url
			const urlParts: string[] = [
				params.service,
				`v${params.version}`,
				params.profile,
				Client.typecastToArray<LocationType>(params.coordinates)
					.map(Client.typecastLocation)
					.map((i) => i.join(','))
					.join(';'),
				(params.format) ? `.${params.format.toLocaleLowerCase()}` : null
			];

			const requestUrl = url.parse(this.baseUri);
			requestUrl.pathname += urlParts.filter((i) => i != null).join('/');

			if (options) {
				requestUrl.query = options; // TODO reformat options
			}

			return new Promise<T>((res, rej) => {

				const _url = url.format(requestUrl);
				this.logger("Requesting: %s", _url);
				request.get(_url, (error, response, body) => {
					if (error) throw error;

					const statusCode = response.statusCode;
					const contentType = response.headers['content-type'];
					const contentEncoding = response.headers['content-encoding'];

					let result;
					if (contentType.match(/^application\/json/)) {
						try {
							result = JSON.parse(body);
						} catch (e) {
							throw e;
						}
					} else {
						throw new Error('Returned content type not supported: ' + contentType);
					}

					if (!result || statusCode !== 200 || result.code !== 'Ok') {
						const code = result.code || 'NO CODE';
						const message = result.message || 'No message';
						throw new Error(`Request error: ${code} (${statusCode}) ${message}`);
					}

					res(result);
				});

			});
		}


		private static typecastToArray<T>(value: T | T[]): T[] {
			return (Array.isArray(value)) ? value : [value];
		}

		private static typecastLocation(location: LocationType): [ number, number ] {
			if (Array.isArray(location)) return location;
			else {
				const props = Object.getOwnPropertyNames(location);
				const result: [number, number] = [
					props.lastIndexOf('long') >= 0 ? location['long'] : location['longitude'],
					props.lastIndexOf('lat') >= 0 ? location['lat'] : location['latitude'],
				];
				return result;
			}
		}

	}

	export function createClient(baseUri: string): Client {
		return new Client(baseUri);
	}

}


export namespace types {

	export type LocationType = io.LocationType;
	export type GeometryType = "polyline" | "polyline6" | "geojson";

	export interface RouteInterface {
		distance: number,
		duration: number,
		geometry?: string | any, // TODO put geometry definition
		weight: number,
		weight_name: string,
		legs?: RouteLegInterface[]
	}

	export interface RouteLegInterface {
		distance: number,
		duration: number,
		weight: number,
		summary?: string,
		steps?: RouteStepInterface[],
		annotation?: AnnotationInterface
	}

	export type AnnotationType = "nodes" | "distance" | "duration" | "datasources" | "weight" | "speed";

	export interface AnnotationInterface {
		distance?: number[],
		duration?: number[],
		datasources?: number[],
		nodes?: number[],
		weight?: number[],
		speed?: number[],
	}

	export interface RouteStepInterface {
		distance: number,
		duration: number,
		geometry: string | any, // TODO put geometry definition
		weight: number,
		name: string,
		ref?: string,
		pronunciation?: string,
		destinations?: string[], // TODO ensure it's correct
		exits?: string[], // TODO ensure it's correct
		mode?: string,
		maneuver?: StepManeuverInterface,
		intersections?: IntersectionInterface[],
		rotary_name?: string,
		rotary_pronunciation?: string
	}

	export type StepManeuverType = string; // TODO put values from doc

	export type StepManeuverModifier = string; // TODO put values from doc

	export interface StepManeuverInterface {
		location: LocationType,
		bearing_before: number,
		bearing_after: number,
		type: StepManeuverType,
		modifier: StepManeuverModifier,
		exit?: number
	}

	export type LaneIndication = string; // TODO put values from doc

	export interface LaneInterface {
		indications: LaneIndication,
		valid: boolean
	}

	export interface IntersectionInterface {
		location: LocationType,
		bearings: number[],
		classes: string[],
		entry: boolean[],
		in: number,
		out: number,
		lanes: LaneInterface[]
	}

	export interface WaypointInterface {
		name: string,
		location: LocationType,
		hint?: string
	}
}

export interface RouteOptions extends io.RequestOptionsInterface {
	alternatives?: boolean | number,
	steps?: boolean,
	annotations?: boolean | types.AnnotationType,
	geometries?: types.GeometryType | types.GeometryType[],
	overview?: "full" | "simplified" | false,
	continue_straight?: "default" | boolean
}

export interface RouteResponse extends io.ResponseInterface {
	code: io.CodeType | "NoRoute",
	routes: types.RouteInterface[],
	waypoints: types.WaypointInterface[]
}

export class OsrmClient {

	private readonly version: number;
	private readonly profile: string;
	private readonly io: io.Client;

	constructor(baseUri: string, version: number = 1, profile: string = "driving") {
		this.io = new io.Client(baseUri);
		this.version = version;
		this.profile = profile;
	}

	public route(coordinates: types.LocationType[], options?: RouteOptions): Promise<RouteResponse> {
		return this.io.request<RouteResponse>({
			service: "route",
			profile: this.profile,
			version: this.version,
			coordinates: coordinates
		});
	}

}