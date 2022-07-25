<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { TransactionResponse } from "$models/transaction";
	import type { Load } from "@sveltejs/kit";
	import { AuthRole, type Auth } from "$models/auth";

	function fetchData(auth?: Auth, page?: number) {
		return api.getMany<TransactionResponse[]>("/transfer", {
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
	import Pagination from "$components/data/Pagination.svelte";
	import { session } from "$app/stores";
	import { idrFormat } from "$utils/data";
	import type { ApiResponse } from "$models/api";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import TransferFragment from "$pages/fragment/TransferFragment.svelte";

	export let data: ApiResponse<TransactionResponse[]> | null;
	let transactions: TransactionResponse[];

	let page: number;
	let pageSize: number;
	let totalItems: number;

	$: if (data) {
		transactions = data.data;
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

	let isTransferring = false;
</script>

{#if $session.auth?.user.role === AuthRole.Customer}
	<div
		class="flex flex-wrap gap-2 justify-end my-2 pb-2 border-b border-slate-200"
	>
		<div class="flex-grow">
			<h2 class="font-serif">Transaction History</h2>
		</div>
		<div>
			<button
				type="button"
				class="primary"
				on:click={() => (isTransferring = true)}>Transfer</button
			>
		</div>
	</div>

	<TransferFragment bind:isOpen={isTransferring} bind:transactions {pageSize} />
{/if}

<div class="w-full overflow-x-auto rounded-md" class:overflow-hidden={loading}>
	<SpinnerOverlay {loading} />
	<table class="data-table">
		<thead>
			<tr>
				<th>Sender</th>
				<th>Receiver</th>
				<th>Amount (IDR)</th>
				<th>Date</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as transaction}
				<tr>
					<td>{transaction.sender.user.username}</td>
					<td>{transaction.receiver.user.username}</td>
					<td class="text-right">{idrFormat(transaction.amount)}</td>
					<td class="text-center font-mono">{transaction.created}</td>
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
