<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Login" },
		};
	};
</script>

<script lang="ts">
	import FormItem from "$components/input/FormItem.svelte";
	import { AppError } from "$models/error";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import { session } from "$app/stores";
	import { sessionManager } from "$services/session-manager";
	import { toast } from "$stores/toast";
	import { goto } from "$app/navigation";

	let username = "";
	let password = "";

	let loading = false;
	let error: AppError | null;

	const submitHandler = async (e: SubmitEvent) => {
		e.preventDefault();

		try {
			loading = true;
			error = null;

			await sessionManager.login(session, { username, password });

			toast.success({
				title: `Welcome ${$session.auth?.user.username}!`,
				message: "You have successfully logged in.",
			});
			goto("/");
		} catch (err) {
			error = new AppError(err);
		} finally {
			loading = false;
		}
	};
</script>

<SpinnerOverlay {loading} />

<div>
	<h3 class="mb-2">Login</h3>
	<hr class="mb-4" />
	{#if error}
		<div class="flex flex-col items-center text-red-500">
			<div class="font-serif font-bold">{error.title}</div>
			<div class="text-sm">{error.message}</div>
		</div>
		<hr class="mt-2 mb-4" />
	{/if}
	<form on:submit={submitHandler}>
		<div class="flex flex-col">
			<FormItem label="Username" id="login:username">
				<input id="login:username" bind:value={username} />
			</FormItem>
			<FormItem label="Password" id="login:password">
				<input id="login:password" type="password" bind:value={password} />
			</FormItem>
			<button type="submit" class="primary mt-2"> Submit </button>
		</div>
	</form>
</div>
