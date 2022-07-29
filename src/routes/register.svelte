<script lang="ts" context="module">
	import type { Load } from "@sveltejs/kit";

	export const load: Load = () => {
		return {
			stuff: { title: "Register" },
		};
	};
</script>

<script lang="ts">
	import FormItem from "$components/input/FormItem.svelte";
	import { getReadableFileSize, kilobyte } from "$utils/file";
	import { api } from "$services/api";
	import { AppError } from "$models/error";
	import SpinnerOverlay from "$components/overlay/SpinnerOverlay.svelte";
	import { toast } from "$stores/toast";

	let username = "";
	let password = "";
	let fullname = "";

	let files: FileList | undefined;

	let file: File | null | undefined;
	$: file = files?.item(0);

	let size = 0;
	$: size = file ? file.size : 0;

	const maxSize = 5 * kilobyte * kilobyte;

	let imgUrl = "";

	const fileChangeHandler = () => {
		if (imgUrl !== "") {
			URL.revokeObjectURL(imgUrl);
		}

		if (file) {
			imgUrl = URL.createObjectURL(file);
		}
	};

	let status = "";
	let error: AppError | null;

	const submitHandler = async () => {
		if (!file) {
			toast.error({
				title: "Invalid Input",
				message: "Please provide an image of your ID Card.",
			});
			return;
		}

		try {
			status = "loading";
			error = null;
			await api.register({
				user: { username, password },
				fullname,
				idCardImage: file,
			});
			status = "success";
			toast.success({
				title: "Successful",
				message: `Successfully signed up as @${username}. Please wait for your account to be verified.`,
				duration: 6000,
			});
		} catch (err) {
			error = new AppError(err);
			status = "error";
		}
	};
</script>

<SpinnerOverlay loading={status === "loading"} />

<div>
	<h3 class="mb-2">Sign Up</h3>
	<hr class="mb-4" />
	{#if status === "success"}
		<div class="flex flex-col items-center px-6">
			<div class="font-serif text-xl">Successfully signed up!</div>
			<div>Please wait for your account to be verified.</div>
			<div>
				<a href="/login" class="text-rose-500">Click here to login</a>.
			</div>
		</div>
	{/if}

	<!--
		must use hidden class to prevent rerendering
		@see https://stackoverflow.com/a/42777812
	-->
	<div class:hidden={status === "success"}>
		{#if error}
			<div class="flex flex-col items-center text-red-500">
				<div class="font-serif font-bold">{error.title}</div>
				<div class="text-sm">{error.message}</div>
			</div>
			<hr class="mt-2 mb-4" />
		{/if}
		<div class="flex flex-col">
			<FormItem label="Username" id="register:username">
				<input
					id="register:username"
					name="username"
					type="text"
					bind:value={username}
				/>
				<div class="text-sm text-slate-600 self-end">
					5-25 characters of alphabet, number, and underscore (_).
				</div>
			</FormItem>
			<FormItem label="Password" id="register:password">
				<input
					id="register:password"
					name="password"
					type="password"
					bind:value={password}
				/>
			</FormItem>
			<FormItem label="Fullname" id="register:fullname">
				<input
					id="register:fullname"
					name="fullname"
					type="text"
					bind:value={fullname}
				/>
			</FormItem>
			<FormItem id="register:idCardImage" label="ID Card Image">
				<input
					id="register:idCardImage"
					name="idCardImage"
					type="file"
					accept="image/jpeg, image/png, image/gif"
					bind:files
					on:change={fileChangeHandler}
				/>
				<div
					class="text-sm text-slate-600 self-end"
					class:text-red-500={size > maxSize}
				>
					{#if !file}
						Maximum 5 MB.
					{:else}
						{getReadableFileSize(size)} / 5 MB.
					{/if}
				</div>
			</FormItem>
			{#if imgUrl}
				<div>
					<img
						src={imgUrl}
						alt="Chosen ID Card"
						class="max-w-xs max-h-48 mx-auto"
					/>
				</div>
			{/if}
			<button class="primary mt-2" on:click={submitHandler}> Submit </button>
		</div>
	</div>
</div>
