<script lang="ts">
	import "$root/app.css";
	import Header from "$lib/components/layout/Header.svelte";
	import { auth } from "$lib/stores/auth";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";

	$: if (browser && $auth === null) {
		goto("/login");
	}
</script>

<div class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg">
	<Header class="h-14" />
</div>

<main>
	<slot />
</main>
