<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ error }) => {
		if (isTokenError(error)) {
			return {
				status: 307,
				redirect: "/logout",
			};
		}

		return {
			stuff: {
				title: "Error",
			},
		};
	};
</script>

<script lang="ts">
	import { AppError } from "$models/error";
	import { isTokenError } from "$utils/error";
	import { page } from "$app/stores";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";

	const support = "13520024@std.stei.itb.ac.id";

	const back = () => {
		if (browser) {
			window.history.back();
		}
	};

	if (isTokenError($page.error) && browser) {
		goto("/logout");
	}
</script>

<div class="w-full mt-28 px-2 flex justify-center">
	<div class="max-w-3xl flex flex-col text-white">
		<h1>{AppError.getTitle($page.error)}</h1>

		<div class="my-6 text-lg font-mono whitespace-pre-wrap">
			{AppError.getMessage($page.error)}
		</div>

		<hr class="my-4 border-white" />

		<div>
			Please
			<a href="mailto:{support}" target="_blank" class="text-yellow-500">
				contact our support ({support})
			</a>
			if you think this is a mistake.
		</div>
		<div class="mt-4 text-right">
			<button class="primary" on:click={back}> Go back </button>
		</div>
	</div>
</div>
