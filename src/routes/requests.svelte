<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { Load } from "@sveltejs/kit";
	import { AuthRole, type Auth } from "$models/auth";

	function fetchData(auth?: Auth, skip = 0, take = 25) {
		return api.getMany<any[]>("/request", {
			auth,
			skip,
			take,
		});
	}

	export const load: Load = async ({ session }) => {
		const response = await fetchData(session.auth).catch(toast.forwardError());

		return {
			stuff: { title: "Requests" },
			props: {
				response,
			},
		};
	};
</script>

<script lang="ts">
	import { session } from "$app/stores";
	import AdminRequestsPage from "$pages/AdminRequestsPage.svelte";
	import CustomerRequestsPage from "$pages/CustomerRequestsPage.svelte";
	import type { ApiCollectionResponse } from "$models/api";

	export let response: ApiCollectionResponse<any>;
</script>

{#if $session.auth?.user.role === AuthRole.Admin}
	<AdminRequestsPage {fetchData} {response} />
{:else}
	<CustomerRequestsPage {fetchData} {response} />
{/if}
