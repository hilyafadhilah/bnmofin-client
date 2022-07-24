<script lang="ts" context="module">
	import { api } from "$lib/services/api";

	import type {
		RespondRequestPayload,
		AdminRequestResponse,
		RequestResponseStatus,
	} from "$root/lib/models/request";
	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session }) => {
		return {
			stuff: { title: "Requests" },
			props: {
				data: api.get<AdminRequestResponse[]>("/request", {
					auth: session.auth,
				}),
			},
		};
	};
</script>

<script lang="ts">
	import Spin from "$lib/components/icons/Spin.svelte";
	import ConfirmDialog from "$lib/components/overlay/ConfirmDialog.svelte";
	import { AppError } from "$lib/models/error";
	import { session } from "$app/stores";
	import { idrFormat } from "$root/lib/utils/data";

	export let data: Promise<AdminRequestResponse[]>;

	let requests: AdminRequestResponse[];

	data
		.then((result) => {
			requests = result;
		})
		.catch((err) => Promise.reject(new AppError(err)));

	// respond

	let selected: AdminRequestResponse | null = null;
	let newStatus: RequestResponseStatus | null = null;

	let showConfirm = false;
	let confirmLoading = false;
	let error: AppError | null = null;

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
				error = null;

				await api.send<RespondRequestPayload>(`request/${selected.id}/status`, {
					method: "put",
					payload: { status: newStatus },
					auth: $session.auth,
				});

				selected.status = newStatus;
				requests = requests;
			} catch (err) {
				error = new AppError(err);
				console.error(error);
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
	<Spin class="h-24 w-24" />
{:then}
	<table>
		<thead>
			<tr>
				<th colspan="2">Requester</th>
				<th>Amount (IDR)</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each requests as request}
				<tr>
					<td>{request.customer.user.username}</td>
					<td>({request.customer.fullname})</td>
					<td class="text-right">{idrFormat(request.amount)}</td>
					<td>
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
								Reject
							</button>
						{:else}
							<button class="primary w-full" disabled>
								{request.status === "accepted" ? "Accepted" : "Declined"}
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Confirm verify -->
	<ConfirmDialog
		bind:isOpen={showConfirm}
		loading={confirmLoading}
		on:confirm={respond}
	>
		{#if selected && newStatus}
			<div class="flex flex-col text-center">
				<div>
					You are about to {newStatus === "accepted" ? "give" : "reject"}
				</div>
				<div class="text-2xl">
					<strong>{idrFormat(selected.amount)}</strong>
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
{:catch err}
	{err.title}: {err.message}
{/await}
