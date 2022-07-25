<script lang="ts">
	import type { TransactionResponse } from "$models/transaction";
	import { idrFormat } from "$utils/data";

	export let transactions: TransactionResponse[];
</script>

<table class="data-table">
	<thead>
		<tr>
			<th>Sender</th>
			<th>Receiver</th>
			<th>Amount (IDR)</th>
			<th>Date</th>
		</tr>
	</thead>
	<tbody>
		{#each transactions as transaction}
			<tr>
				<td>{transaction.sender.user.username}</td>
				<td>{transaction.receiver.user.username}</td>
				<td class="text-right">{idrFormat(transaction.amount)}</td>
				<td class="text-center font-mono">{transaction.created}</td>
			</tr>
		{/each}
	</tbody>
</table>
