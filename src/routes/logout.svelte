<script lang="ts" context="module">
	import { sessionManager } from "$services/session-manager";

	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session }) => {
		sessionManager.logout(session);

		return {
			stuff: { title: "Logout" },
		};
	};
</script>

<script>
	import { browser } from "$app/env";
	import { goto } from "$app/navigation";

	if (browser) {
		goto("/login");
	}
</script>

Logging out...
