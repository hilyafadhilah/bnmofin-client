<script lang="ts">
	import '$/app.css';
	import Header from '$/components/layout/Header.svelte';
	import { auth } from '$/stores/auth';
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';

	$: console.log($auth);
	$: if (browser && $auth === null) {
		goto('/login');
	}
</script>

<div class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg">
	<Header class="h-14" />
</div>

<main>
	<slot />
</main>
