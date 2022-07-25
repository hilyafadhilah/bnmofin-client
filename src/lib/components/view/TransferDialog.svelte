<script lang="ts">
	import type { CurrenciesResponse } from "$models/money";
	import type { TransferPayload } from "$models/transaction";
	import { idrFormat } from "$utils/data";
	import { createEventDispatcher } from "svelte";

	import FormItem from "../input/FormItem.svelte";
	import Dialog from "../overlay/Dialog.svelte";
	import Overlay from "../overlay/Overlay.svelte";
	import SpinnerOverlay from "../overlay/SpinnerOverlay.svelte";

	export let isOpen = false;
	export let loading = false;

	export let balance: number | undefined = undefined;

	export let receiver = "";
	export let amount = 0.0;
	export let currency = "IDR";
	export let currencies: CurrenciesResponse = {};

	const dispatch = createEventDispatcher<{ submit: TransferPayload }>();

	const submitHandler = (e: SubmitEvent) => {
		e.preventDefault();
		dispatch("submit", {
			username: receiver,
			money: { amount, currency },
		});
	};
</script>

<Overlay class="flex flex-col items-center justify-center" bind:isOpen>
	<Dialog class="w-full max-w-xl" on:close={() => (isOpen = false)}>
		<SpinnerOverlay {loading} />
		<svelte:fragment slot="title">Transfer your money</svelte:fragment>

		<form id="issueRequest" on:submit={submitHandler}>
			<div class="px-2 my-8 mb-12">
				{#if balance !== undefined}
					<div class="flex flex-col mb-4">
						<div>Current balance:</div>
						<div
							class="ml-4 text-xl font-mono"
							class:text-red-500={balance <= 0}
						>
							{idrFormat(balance)}
						</div>
					</div>
				{/if}
				<FormItem id="receiver" label="Username">
					<input
						id="receiver"
						type="text"
						placeholder="Receiver's username"
						required
						bind:value={receiver}
					/>
				</FormItem>
				<FormItem id="currency" label="Currency">
					<select id="currency" bind:value={currency} class="font-mono">
						{#each Object.keys(currencies) as symbol}
							<option value={symbol}>
								{symbol} - {currencies[symbol]}
							</option>
						{/each}
					</select>
				</FormItem>
				<FormItem id="amount" label="Amount">
					<input
						id="amount"
						type="number"
						pattern={`^\\d*(\\.\\d{0,2})?$`}
						min="0"
						step=".01"
						required
						bind:value={amount}
					/>
					<div class="text-sm text-slate-600 self-end">Can be decimal.</div>
				</FormItem>
			</div>
		</form>

		<svelte:fragment slot="actions">
			<button
				type="button"
				class="primary variant-outline"
				on:click={() => (isOpen = false)}>Cancel</button
			>
			<button type="submit" form="issueRequest" class="primary">Submit</button>
		</svelte:fragment>
	</Dialog>
</Overlay>
