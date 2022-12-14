/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		cookie: Record<string, string>;
	}

	// interface Platform {}

	interface Session {
		auth?: import("$models/auth").Auth;
	}

	interface Stuff {
		title?: string;
	}
}
