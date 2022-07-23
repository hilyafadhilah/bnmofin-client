<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Customers" },
		};
	};
</script>
