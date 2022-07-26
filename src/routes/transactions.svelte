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
			stuff: { title: "Transactions" },
			props: {
				data,
			},
		};
	};
</script>

<script lang="ts">
	import Pagination from "$components/data/Pagination.svelte";
	import { session } from "$app/stores";
	import type { ApiResponse } from "$models/api";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import TransferFragment from "$pages/fragment/TransferFragment.svelte";
	import { sessionManager } from "$services/session-manager";
	import Refresh from "$components/icons/Refresh.svelte";
	import AdminTransactionsTable from "$components/view/AdminTransactionsTable.svelte";
	import CustomerTransactionsTable from "$components/view/CustomerTransactionsTable.svelte";
	import UserLayout from "$components/layouts/UserLayout.svelte";

	let isCustomer = $session.auth?.user.role === AuthRole.Customer;

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

		if (isCustomer) {
			sessionManager.refresh(session, $session);
		}
	};

	let loading: boolean;
	$: loading = !data;

	let isTransferring = false;
</script>

<UserLayout>
	<div
		class="flex flex-wrap gap-2 justify-end my-2 pb-2 border-b border-slate-200"
	>
		<div class="flex-grow">
			<h2 class="font-serif">
				{isCustomer ? "Transaction History" : "Transactions"}
			</h2>
		</div>
		<div class="flex items-center gap-2">
			<button type="button" class="icon" on:click={reload}>
				<Refresh class="text-slate-500" />
			</button>
			{#if isCustomer}
				<button
					type="button"
					class="primary"
					on:click={() => (isTransferring = true)}>Transfer</button
				>
			{/if}
		</div>
	</div>

	<div
		class="w-full overflow-x-auto rounded-md"
		class:overflow-hidden={loading}
	>
		<SpinnerOverlay {loading} />
		{#if isCustomer && $session.auth}
			<CustomerTransactionsTable
				{transactions}
				username={$session.auth.user.username}
			/>
		{:else}
			<AdminTransactionsTable {transactions} />
		{/if}
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
</UserLayout>

{#if isCustomer}
	<TransferFragment bind:isOpen={isTransferring} bind:transactions {pageSize} />
{/if}
