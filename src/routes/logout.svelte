<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";
	import { auth } from "$lib/stores/auth";

	export const load: Load = () => {
		auth.logout();
		return {};
	};
</script>

Logging out...
