<script lang="ts">
	import { session } from "$app/stores";
	import { idrFormat, moneyFormat, timeAgo } from "$utils/data";
	import { toast } from "$stores/toast";
	import { api } from "$services/api";

	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import NewRequestDialog from "$components/view/NewRequestDialog.svelte";
	import Refresh from "$components/icons/Refresh.svelte";
	import UserLayout from "$components/layouts/UserLayout.svelte";
	import Check from "$components/icons/Check.svelte";
	import Cross from "$components/icons/Cross.svelte";

	import { fastSlide } from "$transitions/fast-slide";

	import type { ApiResponse } from "$models/api";
	import type {
		CustomerRequestResponse,
		NewRequestPayload,
	} from "$models/request";
	import type { Auth } from "$models/auth";
	import type { CurrenciesResponse } from "$models/money";

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
	let isSubmitting = false;

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

	const submitRequest = async () => {
		isSubmitting = true;

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
		} catch (error) {
			toast.error(error);
		} finally {
			isSubmitting = false;
			isRequesting = false;
		}
	};
</script>

<UserLayout>
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
			<button
				type="button"
				class="primary"
				on:click={() => (isRequesting = true)}>Issue New Request</button
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
							{request.created}
						</div>
						<div class="flex-grow italic  text-right whitespace-nowrap">
							{timeAgo.format(new Date(request.created))}
						</div>
					</div>
					<hr class="my-2" />
					<div class="flex justify-end font-mono text-md sm:text-lg">
						<div
							class="
								p-2 rounded-md amount
								{request.amount > 0 ? 'positive-amount' : 'negative-amount'}
							"
						>
							{request.amount > 0
								? "+" + idrFormat(request.amount)
								: idrFormat(request.amount)}
						</div>
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
				<button class="primary w-52 text-lg" on:click={loadNext}
					>Load more</button
				>
			</div>
		{/if}
	</div>
</UserLayout>

<NewRequestDialog
	bind:isOpen={isRequesting}
	bind:loading={isSubmitting}
	bind:value={payload}
	{currencies}
	on:submit={() => submitRequest()}
/>

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
	.accepted .amount {
		@apply text-white;
	}
	.accepted .positive-amount {
		@apply bg-emerald-600;
	}
	.accepted .negative-amount {
		@apply bg-rose-500;
	}
</style>
