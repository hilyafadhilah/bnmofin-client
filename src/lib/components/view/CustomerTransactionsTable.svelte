<script lang="ts">
	import type { TransactionResponse } from "$models/transaction";
	import { idrFormat } from "$utils/data";

	export let transactions: TransactionResponse[];
	export let username: string;

	const getType = (t: TransactionResponse) => {
		return t.receiver.user.username === username ? "+" : "-";
	};
</script>

<table class="data-table">
	<thead>
		<tr>
			<th>Type</th>
			<th>Person</th>
			<th>Amount (IDR)</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each transactions as transaction}
			{#if getType(transaction) === "+"}
				<tr class="text-center bg-sky-100 border-sky-300">
					<td>received from</td>
					<td>{transaction.sender.user.username}</td>
					<td class="text-right">+ {idrFormat(transaction.amount)}</td>
					<td class="font-mono">{transaction.created}</td>
				</tr>
			{:else}
				<tr class="text-center bg-amber-100 border-amber-300">
					<td>sent to</td>
					<td>{transaction.sender.user.username}</td>
					<td class="text-right">- {idrFormat(transaction.amount)}</td>
					<td class="font-mono">{transaction.created}</td>
				</tr>
			{/if}
		{/each}
	</tbody>
</table>
