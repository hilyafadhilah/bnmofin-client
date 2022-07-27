<script lang="ts">
	import type { ToastProps } from "$stores/toast";
	import Toast from "./Toast.svelte";

	export let toasts: ToastProps[] = [];
	let visible: ToastProps[] = [];

	setInterval(() => {
		visible = toasts.filter(({ expire }) => expire >= new Date());
	}, 100);
</script>

<div
	class="
	fixed bottom-0 left-0
	w-full max-w-sm
	p-2 sm:p-4
	flex flex-col gap-2 sm:gap-4
"
	style:z-index="999"
>
	{#each visible as toast (toast)}
		<Toast
			title={toast.title}
			message={toast.message}
			type={toast.type}
			variant={toast.variant}
			bind:expire={toast.expire}
		/>
	{/each}
</div>
