<script lang="ts">
	import "$root/app.css";
	import Head from "$components/Head.svelte";
	import Header from "$components/layout/Header.svelte";
	import { page } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";
</script>

<Head title={$page.stuff.title} />

<div
	class="sticky top-0 mb-4 bg-gray-100 text-slate-900 drop-shadow-lg"
	style:z-index="99"
>
	<Header class="h-14" />
</div>

<main>
	<slot />
</main>

<ToastContainer toasts={$toast} />
