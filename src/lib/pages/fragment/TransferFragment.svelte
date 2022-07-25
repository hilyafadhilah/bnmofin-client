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

	import TransferDialog from "$components/view/TransferDialog.svelte";
	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";

	// transactions data, if any

	export let transactions: TransactionResponse[] | undefined = undefined;
	export let pageSize: number | undefined = undefined;

	// currencies, has fallback

	let currencies: CurrenciesResponse = {
		IDR: "Indonesian Rupiah",
	};

	api
		.get<CurrenciesResponse>("/currency/symbols")
		.then((data) => (currencies = data))
		.catch(toast.catchError());

	// state

	export let isOpen = false;

	let showConfirm = false;
	let loading = false;

	let payload: TransferPayload | undefined;

	const confirm = (data: TransferPayload) => {
		payload = data;
		showConfirm = true;
	};

	// action!

	const submitTransfer = async () => {
		if (payload) {
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

				if (transactions && pageSize) {
					if (transactions.length === pageSize) {
						transactions.pop();
					}
				}

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
			} catch (error) {
				toast.error(error);
			} finally {
				loading = false;
				showConfirm = false;
			}
		}
	};
</script>

<TransferDialog
	bind:isOpen
	bind:loading
	{currencies}
	balance={$session.auth?.customer?.balance}
	on:submit={(e) => confirm(e.detail)}
/>

<ConfirmDialog
	bind:isOpen={showConfirm}
	bind:loading
	on:confirm={submitTransfer}
>
	{#if payload}
		<div class="flex flex-col text-center">
			<div>You are about to</div>
			<div class="text-xl">
				<strong class="text-rose-500">SEND</strong>
			</div>
			<div class="text-2xl sm:text-3xl break-words">
				<strong class="text-rose-500">
					{moneyFormat(payload.money.amount, payload.money.currency)}
				</strong>
			</div>
			<div class="-mt-2 text-md sm:text-lg break-words">
				<strong class="text-rose-500">
					({currencies[payload.money.currency]})
				</strong>
			</div>
			<div>to</div>
			<div class="lg">
				<strong>{payload.username}</strong>
			</div>
			<div class="mt-2">
				Once you continue, you cannot take back your money.
			</div>
		</div>
	{/if}
</ConfirmDialog>
