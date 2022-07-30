<script lang="ts">
	export let value: string;
	export let filter: string | RegExp;
	export let show = true;

	let span: HTMLSpanElement | undefined;
	let flags = "i";

	$: if (span) {
		if (filter && show) {
			const regex = new RegExp(filter, flags);
			span.innerHTML = value.replace(regex, (match) => `<mark>${match}</mark>`);
		} else {
			span.innerHTML = value;
		}
	}
</script>

<span bind:this={span}>{value}</span>
