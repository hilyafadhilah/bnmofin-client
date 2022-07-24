<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Login" },
		};
	};
</script>

<script lang="ts">
	import FormItem from "$lib/components/input/FormItem.svelte";
	import { AppError } from "$lib/models/error";
	import SpinnerOverlay from "$lib/components/overlay/SpinnerOverlay.svelte";
	import { session } from "$app/stores";
	import { api } from "$lib/services/api";
	import { set as setCookie } from "es-cookie";

	let username = "";
	let password = "";

	let loading = false;
	let error: AppError | null;

	const submitHandler = async (e: SubmitEvent) => {
		e.preventDefault();

		try {
			loading = true;
			error = null;

			const auth = await api.login({ username, password });
			session.update((value) => {
				value.auth = auth;
				return value;
			});
			setCookie("token", auth.token);
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
			<FormItem label="Username" id="username">
				<input id="username" bind:value={username} />
			</FormItem>
			<FormItem label="Password" id="password">
				<input id="password" type="password" bind:value={password} />
			</FormItem>
			<button type="submit" class="primary mt-2"> Submit </button>
		</div>
	</form>
</div>
