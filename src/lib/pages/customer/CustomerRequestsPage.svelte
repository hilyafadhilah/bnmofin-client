<script lang="ts">
	import { session } from "$app/stores";
	import { idrFormat } from "$utils/data";
	import { toast } from "$stores/toast";

	import Pagination from "$components/data/Pagination.svelte";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";

	import type { ApiResponse } from "$models/api";
	import type {CustomerRequestResponse} from "$models/request";
	import type { Auth } from "$models/auth";

	export let fetchData: (
		auth?: Auth,
		page?: number
	) => Promise<ApiResponse<CustomerRequestResponse[]>>;
	export let data: ApiResponse<CustomerRequestResponse[]> | null;
	let requests: CustomerRequestResponse[];

	let page: number;
	let pageSize: number;
	let totalItems: number;

	$: if (data) {
		requests = data.data;
		page = data.meta.page;
		pageSize = data.meta.pageSize;
		totalItems = data.meta.totalItems;
	}

	const reload = () => {
		data = null;
		fetchData($session.auth, page)
			.then((d) => (data = d))
			.catch(toast.catchError());
	};

	let loading: boolean;
	$: loading = !data;
</script>

<div class="w-full overflow-x-auto rounded-md" class:overflow-hidden={loading}>
	<SpinnerOverlay {loading} />
	<table class="data-table">
		<thead>
			<tr>
				<th>Amount (IDR)</th>
				<th>Date</th>
				<th>Status</th>
			</tr>
		</thead>
		<tbody>
			{#each requests as request}
				<tr class={request.status}>
					<td class="text-right">{idrFormat(request.amount)}</td>
					<td class="text-center font-mono">{request.created}</td>
					<td class="text-center">{request.status}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	tr.accepted {
		@apply bg-emerald-100 border-emerald-300;
	}
	tr.declined {
		@apply bg-red-100 border-red-300;
	}
</style>

<div class="w-full my-4 flex justify-end">
	<Pagination
		bind:page
		{pageSize}
		{totalItems}
		on:change={reload}
		disabled={loading}
	/>
</div>
