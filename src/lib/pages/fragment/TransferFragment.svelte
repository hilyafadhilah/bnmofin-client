<script lang="ts">
	import { session } from "$app/stores";

	import { api } from "$services/api";
	import { toast } from "$stores/toast";
	import { moneyFormat } from "$utils/data";

	import type { CurrenciesResponse } from "$models/money";
	import type {
		TransactionResponse,
		TransferPayload,
		TransferResponse,
	} from "$models/transaction";

	import TransferDialog from "$components/views/TransferDialog.svelte";
	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";
	import Money from "$components/data/Money.svelte";
	import { moneyConfig } from "$root/config";

	// transactions data, if any

	export let transactions: TransactionResponse[] | undefined = undefined;

	// currencies, has fallback

	let currencies: CurrenciesResponse = {
		[moneyConfig.defaultCurrency.symbol]: moneyConfig.defaultCurrency.name,
	};

	api
		.get<CurrenciesResponse>("/currency/symbols")
		.then((data) => (currencies = data))
		.catch(toast.catchError);

	// state

	export let isOpen = false;

	let showConfirm = false;
	let loading = false;

	let payload: TransferPayload;

	const reset = () => {
		payload = {
			username: "",
			money: {
				currency: moneyConfig.defaultCurrency.symbol,
				amount: 100000,
			},
		};
	};

	reset();

	// confirm: load the user & amount

	let preloaded: TransferResponse;

	const confirm = async () => {
		loading = true;

		try {
			preloaded = await api.send<TransferPayload, TransferResponse>(
				"/transfer",
				{
					method: "post",
					payload,
					auth: $session.auth,
					query: { intent: "preload" },
				}
			);

			showConfirm = true;
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	// action!

	const submitTransfer = async () => {
		loading = true;

		try {
			const transaction = await api.send<TransferPayload, TransferResponse>(
				"/transfer",
				{
					method: "post",
					payload,
					auth: $session.auth,
				}
			);

			toast.success({
				title: "Successful",
				message: `Successfully sent ${moneyFormat(
					payload.money.amount,
					payload.money.currency
				)} to ${payload.username}.`,
				duration: 5000,
			});

			isOpen = false;

			if (transactions) {
				transactions.splice(0, 0, transaction);
				transactions = transactions;
			}

			session.update((value) => {
				if (value.auth?.customer) {
					value.auth.customer.balance = transaction.sender.balance;
				}
				return value;
			});

			reset();
		} catch (error) {
			toast.error(error);
		} finally {
			loading = false;
			showConfirm = false;
		}
	};
</script>

<TransferDialog
	bind:value={payload}
	bind:isOpen
	bind:loading
	{currencies}
	balance={$session.auth?.customer?.balance}
	on:submit={() => confirm()}
/>

<ConfirmDialog
	bind:isOpen={showConfirm}
	bind:loading
	on:confirm={submitTransfer}
>
	{#if payload}
		<div class="flex flex-col text-center">
			<div>You are about to</div>
			<div class="mt-2 text-xl">
				<strong class="text-rose-500 uppercase">send</strong>
			</div>
			<div class="mt-2 flex justify-center text-2xl sm:text-3xl">
				<Money amount={-preloaded.amount} abs />
			</div>
			<div class="text-md sm:text-lg break-words">
				<Money
					amount={payload.money.amount}
					currency={payload.money.currency}
					unstyled
				/>
			</div>
			<div>to</div>
			<div class="text-slate-700">
				<strong class="font-semibold text-xl">@{payload.username}</strong>
				<div class="-mt-1 text-lg">({preloaded.receiver.fullname})</div>
			</div>
			<div class="mt-2">
				Once you continue, you cannot take back your money.
			</div>
		</div>
	{/if}
</ConfirmDialog>
