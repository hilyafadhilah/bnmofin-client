import { onMount } from 'svelte';
import { readable } from 'svelte/store';

export const document = readable<Document | null>(null, (set) => {
	onMount(() => {
		set(window.document);
	});

	return () => {};
});
