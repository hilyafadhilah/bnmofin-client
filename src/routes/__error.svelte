<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
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

	const back = () => {
		if (browser) {
			window.history.back();
		}
	};
</script>

<div class="w-full mt-28 flex justify-center">
	<div class="max-w-xl flex flex-col items-center">
		<h1>{AppError.getTitle($page.error)}</h1>

		<div class="mt-6 text-lg font-mono whitespace-pre-wrap">
			{AppError.getMessage($page.error)}
		</div>

		{#if isTokenError($page.error)}
			<div>
				<a href="/logout" class="text-rose-500">
					Click here to log in again.
				</a>
			</div>
		{:else}
			<div class="mt-4">
				<button class="primary" on:click={back}> Go back </button>
			</div>
		{/if}
	</div>
</div>
