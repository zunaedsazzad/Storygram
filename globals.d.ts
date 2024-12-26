export {};

export type Roles =
	| "oca"
	| "president"
	| "vicepresident"
	| "generalsecretary"
	| "instructor"
	| "treasurer";

declare global {
	interface CustomJwtSessionClaims {
		metadata: {
			role?: Roles;
		};
	}
}
