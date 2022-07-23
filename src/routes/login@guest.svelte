<script lang="ts">
	import Head from "$lib/components/Head.svelte";
	import FormItem from "$lib/components/input/FormItem.svelte";
	import { auth } from "$lib/stores/auth";
	import { AppError } from "$root/lib/models/error";

	let username = "";
	let password = "";

	let status = "";
	let error: AppError;

	const submitHandler = async () => {
		try {
			status = "loading";
			await auth.login(username, password);
			status = "success";
		} catch (err) {
			error = new AppError(err);
			status = "error";
		}
	};
</script>

<Head title="Login" />
<div>
	<h3 class="mb-2">Login</h3>
	<hr class="mb-4" />
	{#if status === "loading"}
		Loading...
	{:else if status === "success"}
		Successfully logged in.
	{:else}
		{#if error}
			<div class="flex flex-col items-center text-red-500">
				<div class="font-serif font-bold">{error.title}</div>
				<div class="text-sm">{error.message}</div>
			</div>
			<hr class="mt-2 mb-4" />
		{/if}
		<form>
			<div class="flex flex-col">
				<FormItem label="Username" id="username">
					<input id="username" bind:value={username} />
				</FormItem>
				<FormItem label="Password" id="password">
					<input id="password" type="password" bind:value={password} />
				</FormItem>
				<button class="mt-2" on:click={submitHandler}> Submit </button>
			</div>
		</form>
	{/if}
</div>
