<script lang="ts">
	export let label: string;
	export let id: string;
</script>

<div class="mb-4 flex flex-col">
	<label for={id}>{label}</label>
	<slot />
</div>
