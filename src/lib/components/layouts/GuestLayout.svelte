<script lang="ts">
	import "$root/app.css";
	import CompactHeader from "$components/layout/CompactHeader.svelte";
	import { session } from "$app/stores";
</script>

{#if !$session.auth}
	<div class="w-full min-h-screen px-4 bg-teal-900">
		<CompactHeader class="py-4 text-white" />

		<main class="h-full mt-8 flex items-center justify-center pb-12">
			<div
				class="w-full sm:w-fit py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl shadow-lg"
			>
				<slot />
			</div>
		</main>
	</div>
{/if}
