<script lang="ts">
	import type { TransactionResponse } from "$models/transaction";
	import { idrFormat, timeAgo } from "$utils/data";

	export let transaction: TransactionResponse;
</script>

<div class="card flex flex-col">
	<div class="flex flex-wrap text-slate-500 text-sm justify-between">
		<div class="flex-grow font-mono">
			{transaction.created}
		</div>
		<div class="flex-grow italic  text-right whitespace-nowrap">
			{timeAgo.format(new Date(transaction.created))}
		</div>
	</div>
	<div class="mt-4">
		<div class="font-bold text-slate-500 text-sm">FROM</div>
		<div class="text-xl">@{transaction.sender.user.username}</div>
	</div>
	<div class="mt-2">
		<div class="font-bold text-slate-500 text-sm">TO</div>
		<div class="text-xl">@{transaction.receiver.user.username}</div>
	</div>
	<hr class="my-2" />
	<div class="flex justify-end font-mono text-lg sm:text-xl">
		<div class="p-2 rounded-md text-emerald-700">
			{idrFormat(transaction.amount)}
		</div>
	</div>
</div>
