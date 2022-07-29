<script lang="ts">
	import type { TransactionResponse } from "$models/transaction";
	import type { Auth } from "$models/auth";
	import DateCreated from "../data/DateCreated.svelte";
	import TimeAgo from "../data/TimeAgo.svelte";
	import Money from "../data/Money.svelte";

	export let transaction: TransactionResponse;
	export let auth: Auth;

	const isSender = transaction.senderId === auth.user.id;
</script>

<div class="card flex flex-col">
	<div class="flex flex-wrap text-slate-500 text-sm justify-between">
		<div class="flex-grow font-mono">
			<DateCreated date={new Date(transaction.created)} />
		</div>
		<div class="flex-grow italic  text-right whitespace-nowrap">
			<TimeAgo date={new Date(transaction.created)} />
		</div>
	</div>
	{#if !isSender}
		<div class="mt-4">
			<div class="font-bold text-slate-500 text-sm">FROM</div>
			<div class="text-xl font-semibold text-slate-700">
				@{transaction.sender.user.username}
			</div>
		</div>
	{:else}
		<div class="mt-2">
			<div class="font-bold text-slate-500 text-sm">TO</div>
			<div class="text-xl font-semibold text-slate-700">
				@{transaction.receiver.user.username}
			</div>
		</div>
	{/if}
	<hr class="my-2" />
	<div class="flex justify-end font-mono text-lg sm:text-xl">
		<Money amount={isSender ? -transaction.amount : transaction.amount} signed />
	</div>
</div>
