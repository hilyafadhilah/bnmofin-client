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
	import type { CustomerCustomerResponse } from "$models/customer";

	import TransferDialog from "$components/views/TransferDialog.svelte";
	import ConfirmDialog from "$components/overlay/ConfirmDialog.svelte";

	// transactions data, if any

	export let transactions: TransactionResponse[] | undefined = undefined;

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

	let payload: TransferPayload;

	const reset = () => {
		payload = {
			username: "",
			money: {
				currency: "IDR",
				amount: 100000,
			},
		};
	};

	reset();

	// load the user

	let receiver: CustomerCustomerResponse;
	const getReceiver = async () => {
		loading = true;

		try {
			receiver = await api.get<CustomerCustomerResponse>(
				`/customer/${payload.username}`,
				{ auth: $session.auth }
			);
		} catch (err) {
			toast.error(err);
		} finally {
			loading = false;
		}
	};

	const confirm = async () => {
		await getReceiver();
		showConfirm = true;
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
			<div>
				<strong class="text-lg">@{payload.username}</strong>
				<div class="-mt-1 text-slate-500">({receiver.fullname})</div>
			</div>
			<div class="mt-2">
				Once you continue, you cannot take back your money.
			</div>
		</div>
	{/if}
</ConfirmDialog>
