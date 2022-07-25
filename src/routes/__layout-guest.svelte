<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session }) => {
		if (session.auth) {
			return {
				status: 307,
				redirect: "/",
			};
		}

		return {};
	};
</script>

<script lang="ts">
	import "$root/app.css";
	import Head from "$components/Head.svelte";
	import CompactHeader from "$components/layout/CompactHeader.svelte";
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";
	import { page, session } from "$app/stores";
	import ToastContainer from "$components/feedback/ToastContainer.svelte";
	import { toast } from "$stores/toast";

	$: if (browser && $session.auth) {
		goto("/");
	}
</script>

<Head title={$page.stuff.title} />

<div class="w-full min-h-screen px-4 bg-teal-900">
	<CompactHeader class="py-4 text-white" />

	<main class="h-full mt-8 flex items-center justify-center pb-12">
		<div
			class="w-full sm:w-fit py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl drop-shadow-md"
		>
			<slot />
		</div>
	</main>
</div>

<ToastContainer toasts={$toast} />
