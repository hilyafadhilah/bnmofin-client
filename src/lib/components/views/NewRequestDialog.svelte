<script lang="ts">
	import type { CurrenciesResponse } from "$models/money";
	import type { NewRequestPayload } from "$models/request";
	import { createEventDispatcher } from "svelte";
	import { moneyConfig } from "$root/config";

	import Money from "../data/Money.svelte";
	import FormItem from "../input/FormItem.svelte";
	import Dialog from "../overlay/Dialog.svelte";
	import Overlay from "../overlay/Overlay.svelte";
	import SpinnerOverlay from "../overlay/SpinnerOverlay.svelte";

	export let isOpen = false;
	export let loading = false;

	export let value: NewRequestPayload = {
		money: {
			amount: 0.0,
			currency: moneyConfig.defaultCurrency.symbol,
		},
	};

	export let currencies: CurrenciesResponse = {};

	const dispatch = createEventDispatcher<{ submit: NewRequestPayload }>();

	const submitHandler = (e: SubmitEvent) => {
		e.preventDefault();
		dispatch("submit", value);
	};
</script>

<Overlay class="flex flex-col items-center justify-center" bind:isOpen>
	<Dialog class="w-full max-w-xl" on:close={() => (isOpen = false)}>
		<SpinnerOverlay {loading} />
		<svelte:fragment slot="title">Send a request</svelte:fragment>

		<form id="sendRequest" on:submit={submitHandler}>
			<div class="px-2 my-8 mb-12">
				<FormItem id="currency" label="Currency">
					<select
						id="currency"
						bind:value={value.money.currency}
						class="font-mono"
					>
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
						step=".01"
						bind:value={value.money.amount}
					/>
					<div class="text-sm text-slate-600 self-end">
						Can be decimal, can be negative.
					</div>
				</FormItem>
				<hr class="mb-2" />
				<div class="flex justify-end">
					<Money
						class="text-2xl"
						amount={value.money.amount}
						currency={value.money.currency}
						signed
					/>
				</div>
			</div>
		</form>

		<svelte:fragment slot="actions">
			<button
				type="button"
				class="primary variant-outline"
				on:click={() => (isOpen = false)}>Cancel</button
			>
			<button type="submit" form="sendRequest" class="primary">Submit</button>
		</svelte:fragment>
	</Dialog>
</Overlay>
