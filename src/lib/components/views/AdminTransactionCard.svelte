<script lang="ts">
	import type { TransactionResponse } from "$models/transaction";
	import DateCreated from "../data/DateCreated.svelte";
	import Money from "../data/Money.svelte";
	import TimeAgo from "../data/TimeAgo.svelte";

	export let transaction: TransactionResponse;
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
	<div class="mt-4">
		<div class="font-bold text-slate-500 text-sm uppercase">From</div>
		<div class="text-xl font-semibold text-slate-700">
			@{transaction.sender.user.username}
		</div>
	</div>
	<div class="mt-2">
		<div class="font-bold text-slate-500 text-sm uppercase">To</div>
		<div class="text-xl font-semibold text-slate-700">
			@{transaction.receiver.user.username}
		</div>
	</div>
	<hr class="my-2" />
	<div class="flex justify-end font-mono text-lg sm:text-xl">
		<Money amount={transaction.amount} simple />
	</div>
</div>
