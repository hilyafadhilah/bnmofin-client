<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { TransactionResponse } from "$models/transaction";
	import type { Load } from "@sveltejs/kit";
	import { AuthRole, type Auth } from "$models/auth";

	function fetchData(auth?: Auth, skip = 0, take = 25) {
		return api.getMany<TransactionResponse[]>("/transfer", {
			auth,
			skip,
			take,
		});
	}

	export const load: Load = async ({ session }) => {
		const response = await fetchData(session.auth).catch(toast.forwardError());

		return {
			stuff: { title: "Transactions" },
			props: {
				response,
			},
		};
	};
</script>

<script lang="ts">
	import { session } from "$app/stores";
	import type { ApiResponse } from "$models/api";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import TransferFragment from "$pages/fragment/TransferFragment.svelte";
	import Refresh from "$components/icons/Refresh.svelte";
	import UserLayout from "$components/layouts/UserLayout.svelte";
	import AdminTransactionCard from "$root/lib/components/views/AdminTransactionCard.svelte";
	import CustomerTransactionCard from "$root/lib/components/views/CustomerTransactionCard.svelte";

	let isCustomer = $session.auth?.user.role === AuthRole.Customer;

	export let response: ApiResponse<TransactionResponse[]>;

	let transactions: TransactionResponse[];
	$: transactions = response.data;

	let total: number;
	$: total = response.meta.total;

	let loading = false;

	const reload = async () => {
		loading = true;
		try {
			response = await fetchData($session.auth);
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	const loadNext = async () => {
		loading = true;
		try {
			const { meta, data } = await fetchData(
				$session.auth,
				transactions.length
			);

			if (meta.total === total) {
				transactions = transactions.concat(data);
			} else if (meta.total > total) {
				transactions = [
					...(await loadNew(meta.total - total)),
					...transactions,
					...data,
				];
			}
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	const loadNew = async (take: number, skip = 0) => {
		const { meta, data } = await fetchData($session.auth, skip, take);

		if (meta.take < take) {
			data.push(...(await loadNew(take - meta.take, skip + meta.take)));
		}

		return data;
	};

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

	<div class="w-full rounded-md" class:overflow-hidden={loading}>
		<SpinnerOverlay {loading} />

		<div
			class="grid"
			style="
				grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr));
				row-gap: 1rem;
				column-gap: .8rem;
			"
		>
			{#each transactions as transaction}
				{#if isCustomer && $session.auth}
					<CustomerTransactionCard {transaction} auth={$session.auth} />
				{:else}
					<AdminTransactionCard {transaction} />
				{/if}
			{/each}
		</div>

		{#if transactions.length < total}
			<div class="w-full mt-4 py-6 flex justify-center text-center">
				<button class="primary w-52 text-lg" on:click={loadNext}
					>Load more</button
				>
			</div>
		{/if}
	</div>
</UserLayout>

{#if isCustomer}
	<TransferFragment bind:isOpen={isTransferring} bind:transactions />
{/if}
