<script lang="ts">
	import '@/app.css';
	import CompactHeader from '@/components/layout/CompactHeader.svelte';
</script>

<div class="w-full min-h-screen px-4 bg-teal-900">
	<CompactHeader class="py-4 text-white" />
	
	<main class="h-full mt-8 flex items-center justify-center">
		<div class="w-full sm:w-fit py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-2xl drop-shadow-md">
			<slot />
		</div>
	</main>
</div>
