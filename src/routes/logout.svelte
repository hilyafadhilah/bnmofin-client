<script lang="ts" context="module">
	import { auth } from '$/stores/auth';

	import type { Load } from '@sveltejs/kit';

	export const load: Load = () => {
		auth.logout();
		return {};
	};
</script>

Logging out...
