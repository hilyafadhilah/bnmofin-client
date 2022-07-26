<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Home" },
		};
	};
</script>

<script lang="ts">
	import { session } from "$app/stores";
	import UserLayout from "$components/layouts/UserLayout.svelte";
</script>

<UserLayout>
	Hi, {$session.auth?.user.username}.
</UserLayout>
