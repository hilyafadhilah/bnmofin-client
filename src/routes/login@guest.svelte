<script lang="ts">
	import Head from '$/components/Head.svelte';
	import FormItem from '$/components/input/FormItem.svelte';
	import { auth } from '$/stores/auth';

	let username = '';
	let password = '';

	const submitHandler = () => {
		auth.login(username, password);
	};
</script>

<Head title="Login" />
<div>
	<h3 class="mb-2">Login</h3>
	<hr class="mb-4" />
	<div class="flex flex-col">
		<FormItem label="Username" id="username">
			<input id="username" bind:value={username} />
		</FormItem>
		<FormItem label="Password" id="password">
			<input id="password" type="password" bind:value={password} />
		</FormItem>
		<button class="mt-2" on:click={submitHandler}>
			Submit
		</button>
	</div>
</div>
