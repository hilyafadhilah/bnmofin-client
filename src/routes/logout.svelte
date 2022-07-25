<script lang="ts" context="module">
	import { toast } from "$stores/toast";

	import type { Load } from "@sveltejs/kit";
	import { remove as removeCookie } from "es-cookie";

	export const load: Load = ({ session }) => {
		delete session.auth;
		removeCookie("token");
		toast.push({ message: "Logged out." });

		return {
			status: 307,
			redirect: "/login",
			stuff: { title: "Logout" },
		};
	};
</script>

Logging out...
