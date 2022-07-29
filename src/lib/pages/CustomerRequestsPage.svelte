<script lang="ts">
	import { session } from "$app/stores";
	import { moneyFormat } from "$utils/data";
	import { toast } from "$stores/toast";
	import { api } from "$services/api";

	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import NewRequestDialog from "$components/views/NewRequestDialog.svelte";
	import Refresh from "$components/icons/Refresh.svelte";
	import Check from "$components/icons/Check.svelte";
	import Cross from "$components/icons/Cross.svelte";
	import TimeAgo from "$components/data/TimeAgo.svelte";
	import DateCreated from "$components/data/DateCreated.svelte";
	import Money from "$components/data/Money.svelte";

	import { fastSlide } from "$transitions/fast-slide";

	import type { ApiResponse } from "$models/api";
	import type {
		CustomerRequestResponse,
		NewRequestPayload,
	} from "$models/request";
	import type { Auth } from "$models/auth";
	import type { CurrenciesResponse } from "$models/money";
	import ConfirmDialog from "../components/overlay/ConfirmDialog.svelte";

	export let fetchData: (
		auth?: Auth,
		skip?: number,
		take?: number
	) => Promise<ApiResponse<CustomerRequestResponse[]>>;

	export let response: ApiResponse<CustomerRequestResponse[]>;

	let requests: CustomerRequestResponse[];
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

	// new request

	let currencies: CurrenciesResponse = {
		IDR: "Indonesian Rupiah",
	};

	api
		.get<CurrenciesResponse>("/currency/symbols")
		.then((data) => (currencies = data))
		.catch(toast.catchError());

	let isRequesting = false;
	let showConfirm = false;
	let dialogLoading = false;

	let payload: NewRequestPayload;

	const reset = () => {
		payload = {
			money: {
				amount: 100000.0,
				currency: "IDR",
			},
		};
	};

	reset();

	// preload

	let preloaded: CustomerRequestResponse;

	const confirm = async () => {
		dialogLoading = true;

		try {
			preloaded = await api.send<NewRequestPayload, CustomerRequestResponse>(
				"/request",
				{
					method: "post",
					payload,
					auth: $session.auth,
					query: { intent: "preload" },
				}
			);

			dialogLoading = true;
			showConfirm = true;
		} catch (err) {
			toast.error(err);
		} finally {
			dialogLoading = false;
		}
	};

	const submitRequest = async () => {
		dialogLoading = true;

		try {
			const request = await api.send<
				NewRequestPayload,
				CustomerRequestResponse
			>("/request", {
				method: "post",
				payload,
				auth: $session.auth,
			});

			toast.success({
				title: "Successful",
				message: `Successfully requested ${moneyFormat(
					payload.money.amount,
					payload.money.currency
				)}.`,
				duration: 5000,
			});

			requests.splice(0, 0, request);
			requests = [...requests];

			reset();
			isRequesting = false;
		} catch (error) {
			toast.error(error);
		} finally {
			dialogLoading = false;
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
		<button type="button" class="primary" on:click={() => (isRequesting = true)}
			>Send New Request</button
		>
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
				<hr class="my-2" />
				<div class="flex justify-end font-mono text-md sm:text-lg amount">
					<Money
						amount={request.amount}
						signed
						unstyled={request.response?.status !== "accepted"}
					/>
				</div>
				<hr class="my-2" />
				<div
					style="min-height: 3rem;"
					class="flex-grow flex items-center justify-center gap-2 flex-wrap text-center"
				>
					{#if !request.response}
						<div class="flex items-center justify-start text-slate-500">
							Pending
						</div>
					{:else if request.response.status === "accepted"}
						<div class="flex items-center justify-start text-sky-600">
							<Check class="mr-1" /> Accepted
						</div>
					{:else}
						<div class="flex items-center text-red-500">
							<Cross class="mr-1" /> Declined
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

<NewRequestDialog
	bind:isOpen={isRequesting}
	bind:loading={dialogLoading}
	bind:value={payload}
	{currencies}
	on:submit={() => confirm()}
/>

<ConfirmDialog
	bind:isOpen={showConfirm}
	bind:loading={dialogLoading}
	on:confirm={submitRequest}
>
	{#if payload}
		<div class="flex flex-col text-center">
			<div>You are about to request</div>
			<div class="mt-2 flex justify-center text-2xl sm:text-3xl">
				<Money amount={preloaded.amount} />
			</div>
			<div class="text-md sm:text-lg break-words">
				<Money
					amount={payload.money.amount}
					currency={payload.money.currency}
					simple
				/>
			</div>
			<div class="mt-2">Once you continue, you cannot cancel.</div>
		</div>
	{/if}
</ConfirmDialog>

<style lang="postcss">
	.accepted {
		@apply bg-sky-100 border-sky-300 hover:border-sky-400;
	}
	.accepted hr {
		@apply border-sky-300;
	}
	.declined {
		@apply bg-red-100 border-red-300 hover:border-red-400;
	}
	.declined hr {
		@apply border-red-300;
	}
	.pending {
		@apply bg-slate-50;
	}
	.declined .amount {
		@apply text-red-300 transition-colors;
	}
	.declined:hover .amount {
		@apply text-red-600;
	}
</style>
