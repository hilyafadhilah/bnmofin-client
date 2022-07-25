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
	import { AppError } from "$lib/models/error";
	import { isTokenError } from "$lib/utils/error";
	import { page } from "$app/stores";
</script>

<div class="w-full mt-28 flex justify-center">
	<div class="max-w-xl flex flex-col items-center">
		<h1>{AppError.getTitle($page.error)}</h1>

		<div class="mt-6 text-lg font-mono whitespace-pre-wrap">
			{AppError.getMessage($page.error)}
		</div>

		{#if isTokenError($page.error)}
			<div>
				<a href="/login" class="text-rose-500"> Click here to log in again. </a>
			</div>
		{/if}
	</div>
</div>
