<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { Load } from "@sveltejs/kit";
	import { AuthRole, type Auth } from "$models/auth";

	function fetchData(auth?: Auth, page?: number) {
		return api.getMany<any[]>("/request", {
			auth,
			page,
			pageSize: 25,
		});
	}

	export const load: Load = async ({ session }) => {
		const data = await fetchData(session.auth).catch(toast.forwardError());

		return {
			stuff: { title: "Requests" },
			props: {
				data,
			},
		};
	};
</script>

<script lang="ts">
	import { session } from "$app/stores";
	import AdminRequestsPage from "$pages/admin/AdminRequestsPage.svelte";
	import type { ApiCollectionResponse } from "$models/api";

	export let data: ApiCollectionResponse<any>;
</script>

{#if $session.auth?.user.role === AuthRole.Admin}
	<AdminRequestsPage {fetchData} {data} />
{/if}
