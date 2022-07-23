import path from "path";
import adapter from "@sveltejs/adapter-auto";
import preprocess from "svelte-preprocess";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess({
		postcss: {
			plugins: [tailwindcss(), autoprefixer()],
		},
	}),

	kit: {
		adapter: adapter(),
		alias: {
			$root: path.resolve("src"),
		},
	},
};

export default config;
