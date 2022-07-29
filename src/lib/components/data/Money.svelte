<script lang="ts">
	import { moneyConfig } from "$root/config";
	import { moneyFormat } from "$utils/data";

	export let amount: number;
	export let currency = moneyConfig.defaultCurrency.symbol;
	export let signed = false;
	export let abs = false;
	export let simple = false;
	export let unstyled = false;

	let num: number;
	$: num = abs ? Math.abs(amount) : amount;

	let classes = "";

	$: if (!unstyled) {
		if (simple) {
			classes = amount > 0 ? "text-money-good" : "text-money-bad";
		} else {
			classes =
				" text-white " + (amount > 0 ? "bg-money-good" : "bg-money-bad");
		}
	}
</script>

<div
	class="p-2 rounded-md break-words font-mono
		{classes} {$$props.class}
	"
>
	{signed && !abs && amount > 0 ? "+" : ""}{moneyFormat(num, currency)}
</div>
