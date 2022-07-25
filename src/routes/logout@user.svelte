<script lang="ts" context="module">
	import { sessionManager } from "$services/session-manager";

	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session }) => {
		sessionManager.logout(session);

		return {
			status: 307,
			redirect: "/login",
			stuff: { title: "Logout" },
		};
	};
</script>

Logging out...
