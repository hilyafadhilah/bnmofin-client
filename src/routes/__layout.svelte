<script lang="ts">
	import "$root/app.css";
	import Head from "$components/Head.svelte";
	import { page } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";
</script>

<Head title={$page.stuff.title} />

<slot />

<ToastContainer toasts={$toast} />
