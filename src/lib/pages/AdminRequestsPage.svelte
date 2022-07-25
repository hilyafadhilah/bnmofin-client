<script lang="ts">
	import { session } from "$app/stores";
	import { idrFormat } from "$utils/data";
	import { toast } from "$stores/toast";
	import { api } from "$services/api";

	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";
	import Pagination from "$components/data/Pagination.svelte";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";

	import type { ApiResponse } from "$models/api";
	import type {
		AdminRequestResponse,
		RequestResponseStatus,
		RespondRequestPayload,
	} from "$models/request";
	import type { Auth } from "$models/auth";
	import Refresh from "../components/icons/Refresh.svelte";

	export let fetchData: (
		auth?: Auth,
		page?: number
	) => Promise<ApiResponse<AdminRequestResponse[]>>;
	export let data: ApiResponse<AdminRequestResponse[]> | null;
	let requests: AdminRequestResponse[];

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

				toast.success({
					title: "Successful",
					message: `Successfully ${newStatus} the request.`,
				});

				selected.status = newStatus;
				requests = requests;
			} catch (err) {
				toast.error(err);
			} finally {
				confirmLoading = false;
				showConfirm = false;
				selected = null;
				newStatus = null;
			}
		}
	};
</script>

<div
	class="flex flex-wrap gap-2 justify-end my-2 pb-2 border-b border-slate-200"
>
	<div class="flex-grow">
		<h2 class="font-serif">Requests</h2>
	</div>
	<div class="flex items-center gap-2">
		<button type="button" class="icon" on:click={reload}>
			<Refresh class="text-slate-500" />
		</button>
	</div>
</div>

<div class="w-full overflow-x-auto rounded-md" class:overflow-hidden={loading}>
	<SpinnerOverlay {loading} />
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
	<Pagination
		bind:page
		{pageSize}
		{totalItems}
		on:change={reload}
		disabled={loading}
	/>
</div>

<!-- Confirm verify -->
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
