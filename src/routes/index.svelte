<script lang="ts">
	import Head from "$lib/components/Head.svelte";
	import { auth } from "$root/lib/stores/auth";
</script>

<Head title="Home" />

Hi, {$auth?.user.username}.
