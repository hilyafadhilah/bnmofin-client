<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { Load } from "@sveltejs/kit";
	import type { AdminCustomerResponse } from "$models/customer";
	import { AuthRole, type Auth } from "$models/auth";
	import { UnauthorizedError } from "$models/error";

	function fetchData(auth?: Auth, page?: number) {
		return api.getMany<AdminCustomerResponse[]>("/customer", {
			auth,
			page,
			pageSize: 25,
		});
	}

	export const load: Load = async ({ session }) => {
		if (session.auth?.user.role !== AuthRole.Admin) {
			toast.error(new UnauthorizedError());
			return {
				status: 307,
				redirect: "/",
			};
		}

		const data = await fetchData(session.auth).catch(toast.forwardError());

		return {
			stuff: { title: "Customers" },
			props: {
				data,
			},
		};
	};
</script>

<script lang="ts">
	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";
	import { session } from "$app/stores";
	import { idrFormat } from "$utils/data";
	import ViewCustomerDialog from "$components/view/ViewCustomerDialog.svelte";
	import type { ApiResponse } from "$models/api";
	import Pagination from "$components/data/Pagination.svelte";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";

	export let data: ApiResponse<AdminCustomerResponse[]> | null;
	let customers: AdminCustomerResponse[];

	let page: number;
	let pageSize: number;
	let totalItems: number;

	$: if (data) {
		customers = data.data;
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

				toast.success({
					title: "Successful",
					message: `Successfully verified ${selected.user.username}.`,
				});

				selected.status = "verified";
				customers = customers;
			} catch (err) {
				toast.error(err);
			} finally {
				confirmLoading = false;
				showConfirm = false;
				showDetails = false;
			}
		}
	};
</script>

<div class="w-full overflow-x-auto rounded-md" class:overflow-hidden={loading}>
	<SpinnerOverlay {loading} />
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
	<Pagination
		bind:page
		{pageSize}
		{totalItems}
		on:change={reload}
		disabled={loading}
	/>
</div>

<!-- View Details -->
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
