<script lang="ts" context="module">
	import { api } from "$services/api";
	import { toast } from "$stores/toast";

	import type { Load } from "@sveltejs/kit";
	import type { AdminCustomerResponse, CustomerQuery } from "$models/customer";
	import { AuthRole, type Auth } from "$models/auth";
	import { UnauthorizedError } from "$models/error";

	function fetchData({
		auth,
		skip = 0,
		take = 25,
		query = {},
	}: {
		auth?: Auth;
		skip?: number;
		take?: number;
		query?: CustomerQuery;
	} = {}) {
		return api.getMany<AdminCustomerResponse[]>("/customer", {
			auth,
			skip,
			take,
			query: query as Record<string, any>,
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

		const response = await fetchData({ auth: session.auth }).catch(
			toast.forwardError()
		);

		return {
			stuff: { title: "Customers" },
			props: {
				response,
			},
		};
	};
</script>

<script lang="ts">
	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";
	import { session } from "$app/stores";
	import ViewCustomerDialog from "$components/views/ViewCustomerDialog.svelte";
	import type { ApiResponse } from "$models/api";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import Refresh from "$components/icons/Refresh.svelte";
	import Money from "$components/data/Money.svelte";
	import TimeAgo from "$components/data/TimeAgo.svelte";
	import HighlightText from "$components/data/HighlightText.svelte";
	import Search from "$components/icons/Search.svelte";

	export let response: ApiResponse<AdminCustomerResponse[]>;

	let customers: AdminCustomerResponse[];
	$: customers = response.data;

	let total: number;
	$: total = response.meta.total;

	let filterValue: string | undefined;
	let filter: string;
	$: filter = filterValue ? filterValue.trim() : "";

	let query: CustomerQuery;
	$: query = {
		username: filter ? { startsWith: filter } : undefined,
		fullname: filter ? { startsWith: filter } : undefined,
	};

	let loading = false;

	const reload = async () => {
		loading = true;
		try {
			response = await fetchData({ auth: $session.auth, query });
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	const loadNext = async () => {
		loading = true;
		try {
			const { meta, data } = await fetchData({
				auth: $session.auth,
				skip: customers.length,
			});

			if (meta.total === total) {
				customers = customers.concat(data);
			} else if (meta.total > total) {
				customers = [
					...(await loadNew(meta.total - total)),
					...customers,
					...data,
				];

				// BUG: if there's new data during loadNew, it will be scrambled
				// goodluck i guess. that's why they give you refresh button ;)
			} else {
				// handle deletion? will not be implemented, just reload the page LOL
				// twitter dont even handle it they just say it's deleted when you open a deleted tweet
			}
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	const loadNew = async (take: number, skip = 0) => {
		const { meta, data } = await fetchData({ auth: $session.auth, skip, take });

		if (meta.take < take) {
			data.push(...(await loadNew(take - meta.take, skip + meta.take)));
		}

		return data;
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
				await api.send(`/customer/${selected.user.username}/verify`, {
					method: "put",
					auth: $session.auth,
				});

				toast.success({
					title: "Successful",
					message: `Successfully verified @${selected.user.username}.`,
				});

				selected.status = "verified";
				customers = [...customers];
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

<div
	class="flex flex-wrap gap-2 justify-end mt-2 mb-4 pb-2 border-b border-slate-200"
>
	<div class="flex-grow">
		<h2 class="font-serif">Customers</h2>
	</div>
	<div class="mx-2 flex items-center gap-2">
		<button type="button" class="icon" title="Refresh" on:click={reload}>
			<Refresh class="text-slate-500" />
		</button>
	</div>
</div>

<div class="mb-4">
	<div class="flex">
		<input
			type="text"
			title="Search Customer"
			placeholder="Username or fullname..."
			class="rounded-r-none"
			bind:value={filterValue}
			on:change={reload}
		/>
		<button
			type="button"
			class="primary right-button"
			on:click={() => {
				if (filter) {
					reload();
				}
			}}
		>
			<Search class="h-5 w-5" />
		</button>
	</div>
</div>

<div class="w-full overflow-x-auto rounded-md" class:overflow-hidden={loading}>
	<SpinnerOverlay {loading} />
	<div
		class="grid"
		style="
				grid-template-columns: repeat(auto-fill, minmax(min(18rem, 100%), 1fr));
				row-gap: 1rem;
				column-gap: .8rem;
			"
	>
		{#each customers as customer (customer)}
			<div
				class="clickable-card"
				class:bg-amber-50={customer.status === "unverified"}
				class:border-amber-200={customer.status === "unverified"}
				tabindex="0"
				on:click={() => openDetails(customer)}
			>
				<div class="text-xl font-semibold">
					@<HighlightText
						value={customer.user.username}
						filter={new RegExp("^" + filter)}
					/>
				</div>
				<div>
					<HighlightText
						value={customer.fullname}
						filter={new RegExp("^" + filter)}
					/>
				</div>
				<div class="text-right text-sm italic text-slate-500">
					signed up <TimeAgo date={new Date(customer.created)} />
				</div>
				<hr class="my-2 -mx-2" />
				{#if customer.status === "verified"}
					<div class="flex justify-end">
						<Money amount={customer.balance} simple />
					</div>
				{:else}
					<div class="text-center"><i>unverified</i></div>
				{/if}
			</div>
		{/each}
	</div>
	{#if customers.length < total}
		<div class="w-full mt-4 py-6 flex justify-center text-center">
			<button class="primary w-52 text-lg" on:click={loadNext}>Load more</button
			>
		</div>
	{/if}
</div>

<!-- View Details -->
{#if selected}
	<ViewCustomerDialog
		bind:isOpen={showDetails}
		customer={selected}
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
		<div>You are about to</div>
		<div class="mt-2 text-xl uppercase font-bold">verify</div>
		<div>
			<div class="text-2xl font-semibold">
				@{selected?.user.username}
			</div>
			<div class="text-sm">
				({selected?.fullname})
			</div>
		</div>
		<div class="mt-6">
			Once you verify, you <strong>cannot unverify</strong>.
		</div>
	</div>
</ConfirmDialog>
