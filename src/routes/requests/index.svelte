<script lang="ts" context="module">
	import { api } from "$lib/services/api";

	import type {
		RespondRequestPayload,
		AdminRequestResponse,
		RequestResponseStatus,
	} from "$lib/models/request";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = async ({ session }) => {
		const pagination = {
			page: 1,
			pageSize: 25,
		};

		// @TODO handle error...
		const requests = await api.getMany<AdminRequestResponse[]>("/request", {
			auth: session.auth,
			...pagination,
		});

		return {
			stuff: { title: "Requests" },
			props: {
				data: new Promise((resolve) => resolve(requests)),
				...pagination,
			},
		};
	};
</script>

<script lang="ts">
	import Spin from "$lib/components/icons/Spin.svelte";
	import ConfirmDialog from "$lib/components/overlay/ConfirmDialog.svelte";
	import Pagination from "$lib/components/data/Pagination.svelte";
	import { AppError } from "$lib/models/error";
	import { session } from "$app/stores";
	import { idrFormat } from "$lib/utils/data";
	import type { ApiResponse } from "$lib/models/api";

	export let data: Promise<ApiResponse<AdminRequestResponse[]>>;
	let requests: AdminRequestResponse[];

	export let page: number;
	export let pageSize: number;
	let totalItems = 0;

	$: {
		data.then(({ meta, data }) => {
			// assert(page === meta.page)
			// assert(pageSize === meta.pageSize)
			totalItems = meta.totalItems;
			requests = data;
		});
	}

	const reload = () => {
		data = api.getMany<AdminRequestResponse[]>("/request", {
			auth: $session.auth,
			page,
			pageSize,
		});
	};

	// respond

	let selected: AdminRequestResponse | null = null;
	let newStatus: RequestResponseStatus | null = null;

	let showConfirm = false;
	let confirmLoading = false;

	$: if (!showConfirm) {
		selected = null;
		newStatus = null;
	}

	const confirmRespond = (
		status: RequestResponseStatus,
		selection: AdminRequestResponse
	) => {
		showConfirm = true;
		selected = selection;
		newStatus = status;
	};

	const respond = async () => {
		if (selected && newStatus) {
			try {
				confirmLoading = true;

				await api.send<RespondRequestPayload>(`request/${selected.id}/status`, {
					method: "put",
					payload: { status: newStatus },
					auth: $session.auth,
				});

				selected.status = newStatus;
				requests = requests;
			} catch (err) {
				// @TODO handle error
				console.error(new AppError(err));
			} finally {
				confirmLoading = false;
				showConfirm = false;
				selected = null;
				newStatus = null;
			}
		}
	};
</script>

{#await data}
	<div class="h-96 w-full flex items-center justify-center">
		<Spin class="h-24 w-24 text-rose-500" />
	</div>
{:then}
	<div class="w-full overflow-x-auto">
		<table class="data-table">
			<thead>
				<tr>
					<th colspan="2">Requester</th>
					<th>Amount (IDR)</th>
					<th>Date</th>
					<th class="w-52" />
				</tr>
			</thead>
			<tbody>
				{#each requests as request}
					<tr>
						<td>{request.customer.user.username}</td>
						<td>({request.customer.fullname})</td>
						<td class="text-right">{idrFormat(request.amount)}</td>
						<td class="text-center font-mono">{request.created}</td>
						<td>
							<div class="flex justify-center gap-2">
								{#if request.status === "awaiting"}
									<button
										class="primary"
										on:click={() => confirmRespond("accepted", request)}
									>
										Accept
									</button>
									<button
										class="primary variant-outline"
										on:click={() => confirmRespond("declined", request)}
									>
										Decline
									</button>
								{:else}
									{request.status === "accepted" ? "Accepted" : "Declined"}
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="w-full my-4 flex justify-end">
		<Pagination bind:page {pageSize} {totalItems} on:change={reload} />
	</div>

	<!-- Confirm verify -->
	<div class="relative w-16 h-16">
		<ConfirmDialog
			bind:isOpen={showConfirm}
			loading={confirmLoading}
			on:confirm={respond}
		>
			{#if selected && newStatus}
				<div class="flex flex-col text-center">
					<div>You are about to</div>
					<div class="text-xl">
						{#if newStatus === "accepted"}
							<strong class="text-emerald-500">GIVE</strong>
						{:else}
							<strong class="text-rose-500">REJECT</strong>
						{/if}
					</div>
					<div class="text-2xl sm:text-3xl break-words">
						{#if newStatus === "accepted"}
							<strong class="text-emerald-500">
								{idrFormat(selected.amount)}
							</strong>
						{:else}
							<strong class="text-rose-500">
								{idrFormat(selected.amount)}
							</strong>
						{/if}
					</div>
					<div>
						{newStatus === "accepted" ? "to" : "from"}
					</div>
					<div class="lg">
						<strong
							>{selected.customer.user.username} ({selected.customer
								.fullname})</strong
						>
					</div>
					<div class="mt-2">
						Once you continue, you cannot change your decision.
					</div>
				</div>
			{/if}
		</ConfirmDialog>
	</div>
{:catch error}
	{AppError.getTitle(error)}: {AppError.getMessage(error)}
{/await}
