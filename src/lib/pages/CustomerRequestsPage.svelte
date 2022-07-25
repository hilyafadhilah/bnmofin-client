<script lang="ts">
	import { session } from "$app/stores";
	import { idrFormat, moneyFormat } from "$utils/data";
	import { toast } from "$stores/toast";
	import { api } from "$services/api";

	import Pagination from "$components/data/Pagination.svelte";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import NewRequestDialog from "$components/view/NewRequestDialog.svelte";

	import type { ApiResponse } from "$models/api";
	import type {
		CustomerRequestResponse,
		NewRequestPayload,
	} from "$models/request";
	import type { Auth } from "$models/auth";
	import type { CurrenciesResponse } from "$models/money";
	import { sessionManager } from "../services/session-manager";
	import Refresh from "../components/icons/Refresh.svelte";

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

		sessionManager.refresh(session, $session);
	};

	let loading: boolean;
	$: loading = !data;

	// new request

	let currencies: CurrenciesResponse = {
		IDR: "Indonesian Rupiah",
	};

	api
		.get<CurrenciesResponse>("/currency/symbols")
		.then((data) => (currencies = data))
		.catch(toast.catchError());

	let isRequesting = false;
	let isSubmitting = false;

	let amount = 100.0;
	let currency = "IDR";

	const submitRequest = async (payload: NewRequestPayload) => {
		isSubmitting = true;

		try {
			const request = await api.send<
			NewRequestPayload,
			CustomerRequestResponse
			>("/request", {
				method: "post",
				payload,
				auth: $session.auth,
			});

			toast.success({
				title: "Successful",
				message: `Successfully requested ${moneyFormat(
					payload.money.amount,
					payload.money.currency
				)}.`,
				duration: 5000,
			});

			if (requests.length === pageSize) {
				requests.pop();
			}

			requests.splice(0, 0, request);
			requests = requests;
		} catch (error) {
			toast.error(error);
		} finally {
			isSubmitting = false;
			isRequesting = false;
		}
	};
</script>

<div
	class="flex flex-wrap gap-2 justify-end my-2 pb-2 border-b border-slate-200"
>
	<div class="flex-grow">
		<h2 class="font-serif">Your Requests</h2>
	</div>
	<div class="flex items-center gap-2">
		<button type="button" class="icon" on:click={reload}>
			<Refresh class="text-slate-500" />
		</button>
		<button type="button" class="primary" on:click={() => (isRequesting = true)}
			>Issue New Request</button
		>
	</div>
</div>

<NewRequestDialog
	bind:isOpen={isRequesting}
	bind:loading={isSubmitting}
	bind:amount
	bind:currency
	{currencies}
	on:submit={(e) => submitRequest(e.detail)}
/>

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

<div class="w-full my-4 flex justify-end">
	<Pagination
		bind:page
		{pageSize}
		{totalItems}
		on:change={reload}
		disabled={loading}
	/>
</div>

<style lang="postcss">
	tr.accepted {
		@apply bg-emerald-100 border-emerald-300;
	}
	tr.declined {
		@apply bg-red-100 border-red-300;
	}
</style>
