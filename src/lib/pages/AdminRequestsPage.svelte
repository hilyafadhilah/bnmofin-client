<script lang="ts">
	import { session } from "$app/stores";
	import { idrFormat } from "$utils/data";
	import { toast } from "$stores/toast";
	import { api } from "$services/api";

	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import Refresh from "$components/icons/Refresh.svelte";
	import Cross from "$components/icons/Cross.svelte";
	import Check from "$components/icons/Check.svelte";
	import Money from "$components/data/Money.svelte";
	import TimeAgo from "$components/data/TimeAgo.svelte";
	import DateCreated from "$components/data/DateCreated.svelte";

	import { fastSlide } from "$transitions/fast-slide";

	import type {
		AdminRequestResponse,
		RequestResponseStatus,
		RespondRequestPayload,
		RespondRequestResponse,
	} from "$models/request";
	import type { Auth } from "$models/auth";
	import type { ApiResponse } from "$models/api";

	export let fetchData: (
		auth?: Auth,
		skip?: number,
		take?: number
	) => Promise<ApiResponse<AdminRequestResponse[]>>;

	export let response: ApiResponse<AdminRequestResponse[]>;

	let requests: AdminRequestResponse[];
	$: requests = response.data;

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
			const { meta, data } = await fetchData($session.auth, requests.length);

			if (meta.total === total) {
				requests = [...requests, ...data];
			} else if (meta.total > total) {
				requests = [
					...(await loadNew(meta.total - total)),
					...requests,
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

				const newResponse = await api.send<
				RespondRequestPayload,
				RespondRequestResponse
				>(`request/${selected.id}/response`, {
					method: "post",
					payload: { status: newStatus },
					auth: $session.auth,
				});

				toast.success({
					title: "Successful",
					message: `Successfully ${newStatus} the request.`,
				});

				selected.response = newResponse;

				const customer = { id: selected.customerId, ...selected.customer };
				if (newStatus === "accepted") {
					customer.balance += selected.amount;
				}

				requests = [
					...requests.map((req) => {
						if (req.customerId === customer.id) {
							req.customer.balance = customer.balance;
						}
						return req;
					}),
				];
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
		{#each requests as request}
			<div
				class="
						card flex flex-col
						{request.response
					? request.response.status === 'accepted'
						? 'responded accepted'
						: 'responded declined'
					: 'pending'}
					"
				transition:fastSlide|local={{ axis: "Y", direction: "+" }}
			>
				<div class="flex flex-wrap text-slate-500 text-sm justify-between">
					<div class="flex-grow font-mono">
						<DateCreated date={new Date(request.created)} />
					</div>
					<div class="flex-grow italic  text-right whitespace-nowrap">
						<TimeAgo date={new Date(request.created)} />
					</div>
				</div>
				<div class="mt-4 text-lg font-semibold text-slate-700">
					@{request.customer.user.username}
				</div>
				<div class="mt-2 text-sm font-bold text-slate-500 uppercase">
					Balance:
				</div>
				<div class="font-mono text-slate-500">
					{idrFormat(request.customer.balance)}
				</div>
				<hr class="my-2" />
				<div class="flex justify-end font-mono text-md sm:text-lg amount">
					<Money
						amount={request.amount}
						signed
						unstyled={request.response != null}
					/>
				</div>
				<hr class="my-2" />
				<div
					style="min-height: 3rem;"
					class="flex-grow flex items-center justify-center gap-2 flex-wrap text-center"
				>
					{#if !request.response}
						<button
							class="danger variant-outline flex items-center"
							on:click={() => confirmRespond("declined", request)}
						>
							<Cross class="mr-1" /> Decline
						</button>
						<button
							class="alert flex items-center"
							on:click={() => confirmRespond("accepted", request)}
						>
							<Check class="mr-1" /> Accept
						</button>
					{:else if request.response.status === "accepted"}
						<div class="flex items-center justify-start text-sky-600">
							<div>
								<Check class="mr-1" />
							</div>
							<div>
								Accepted by @{request.response.responder.username}
							</div>
						</div>
					{:else}
						<div class="flex items-center text-red-500">
							<Cross class="mr-1" /> Declined by @{request.response.responder
								.username}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if requests.length < total}
		<div class="w-full mt-4 py-6 flex justify-center text-center">
			<button class="primary w-52 text-lg" on:click={loadNext}>Load more</button
			>
		</div>
	{/if}
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
			<div class="mt-2 text-xl uppercase">
				{#if newStatus === "accepted"}
					{#if selected.amount > 0}
						<strong class="text-money-good">give</strong>
					{:else}
						<strong class="text-money-bad">take</strong>
					{/if}
				{:else}
					<strong>decline</strong>
				{/if}
			</div>
			<div class="mb-4 flex justify-center text-2xl sm:text-3xl break-words">
				{#if newStatus === "accepted"}
					<Money amount={selected.amount} abs />
				{:else}
					<strong class="font-mono">
						{idrFormat(selected.amount)}
					</strong>
				{/if}
			</div>
			<div class="text-slate-500 uppercase font-bold">
				{newStatus === "accepted" && selected.amount > 0 ? "to" : "from"}
			</div>
			<div class="lg">
				<div class="text-xl font-semibold">
					@{selected.customer.user.username}
				</div>
				<div class="text-sm">
					({selected.customer.fullname})
				</div>
			</div>
			<div class="mt-6">
				Once you continue, you cannot change your decision.
			</div>
		</div>
	{/if}
</ConfirmDialog>

<style lang="postcss">
	.responded {
		@apply bg-slate-50;
	}
	.pending {
		@apply bg-amber-50 border-amber-200 hover:border-amber-300;
	}
	.declined .amount {
		@apply text-slate-300 transition-colors;
	}
	.declined:hover .amount {
		@apply text-slate-600;
	}
</style>
