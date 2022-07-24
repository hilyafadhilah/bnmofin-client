<script lang="ts" context="module">
	import { api } from "$lib/services/api";

	import type { Load } from "@sveltejs/kit";
	import type { AdminCustomerResponse } from "$lib/models/customer";

	export const load: Load = async ({ session }) => {
		const pagination = {
			page: 1,
			pageSize: 25,
		};

		// @TODO handle error...
		const customers = await api.getMany<AdminCustomerResponse[]>("/customer", {
			auth: session.auth,
			...pagination,
		});

		return {
			stuff: { title: "Customers" },
			props: {
				data: new Promise((resolve) => resolve(customers)),
				...pagination,
			},
		};
	};
</script>

<script lang="ts">
	import Spin from "$lib/components/icons/Spin.svelte";
	import ConfirmDialog from "$lib/components/overlay/ConfirmDialog.svelte";
	import { AppError } from "$lib/models/error";
	import { session } from "$app/stores";
	import { idrFormat } from "$lib/utils/data";
	import ViewCustomerDialog from "$lib/components/view/ViewCustomerDialog.svelte";
	import type { ApiResponse } from "$lib/models/api";
	import Pagination from "$lib/components/data/Pagination.svelte";

	export let data: Promise<ApiResponse<AdminCustomerResponse[]>>;
	let customers: AdminCustomerResponse[];

	export let page: number;
	export let pageSize: number;
	let totalItems = 0;

	$: {
		data.then(({ meta, data }) => {
			// assert(page === meta.page)
			// assert(pageSize === meta.pageSize)
			totalItems = meta.totalItems;
			customers = data;
		});
	}

	const reload = () => {
		data = api.getMany<AdminCustomerResponse[]>("/customer", {
			auth: $session.auth,
			page,
			pageSize,
		});
	};

	// view

	let selected: AdminCustomerResponse | null = null;
	let showDetails = false;

	const openDetails = async (customer: AdminCustomerResponse) => {
		selected = customer;
		showDetails = true;
	};

	// verify

	let showConfirm = false;
	let confirmLoading = false;

	const confirmVerify = () => {
		showConfirm = true;
	};

	const verify = async () => {
		if (selected) {
			try {
				confirmLoading = true;
				await api.send(`/customer/${selected.userId}/verify`, {
					method: "put",
					auth: $session.auth,
				});
				reload();
			} catch (err) {
				// @TODO: handle error
				console.error(new AppError(err));
			} finally {
				confirmLoading = false;
				showConfirm = false;
				showDetails = false;
			}
		}
	};
</script>

{#await data}
	<div class="h-96 w-full flex items-center justify-center">
		<Spin class="h-24 w-24 text-rose-500" />
	</div>
{:then}
	<div class="overflow-x-auto">
		<table class="data-table">
			<thead>
				<tr>
					<th>Username</th>
					<th>Fullname</th>
					<th>Balance</th>
					<th>Status</th>
					<th>Created</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each customers as customer}
					<tr>
						<td>{customer.user.username}</td>
						<td>{customer.fullname}</td>
						<td class="text-right"
							>{customer.status === "verified"
								? idrFormat(customer.balance)
								: "-"}</td
						>
						<td class="text-center">{customer.status}</td>
						<td class="text-center font-mono">{customer.created}</td>
						<td class="text-right">
							<button
								class="primary w-36"
								class:variant-outline={customer.status === "verified"}
								on:click={() => openDetails(customer)}
							>
								{customer.status === "verified" ? "View" : "View & Verify"}
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="w-full my-4 flex justify-end">
		<Pagination bind:page {pageSize} {totalItems} on:change={reload} />
	</div>

	<!-- View Image -->
	{#if selected}
		<ViewCustomerDialog
			bind:isOpen={showDetails}
			data={selected}
			admin
			on:verify={confirmVerify}
		/>
	{/if}

	<!-- Confirm verify -->
	<ConfirmDialog
		bind:isOpen={showConfirm}
		loading={confirmLoading}
		on:confirm={verify}
	>
		<div class="flex flex-col text-center">
			<div>
				You are about to verify <strong>{selected?.fullname}</strong>.
			</div>
			<div>Once you verify, you cannot unverify.</div>
		</div>
	</ConfirmDialog>
{:catch err}
	{AppError.getTitle(err)}: {AppError.getMessage(err)}
{/await}
