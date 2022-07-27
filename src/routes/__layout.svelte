<script lang="ts">
	import "$root/app.css";
	import { page } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";
	import { firebase } from "$services/firebase";

	firebase.init();
</script>

<svelte:head>
	<title>{$page.stuff.title?.length ? `${$page.stuff.title?.length} | ` : ""}BNMO Wallet</title>
</svelte:head>

<slot />

<ToastContainer toasts={$toast} />
