<script lang="ts">
	import { getStorage, ref, getDownloadURL } from "firebase/storage";
	import type { AdminCustomerResponse } from "$models/customer";
	import { idrFormat } from "$utils/data";
	import Image from "../data/Image.svelte";
	import Spin from "../icons/Spin.svelte";

	import Dialog from "../overlay/Dialog.svelte";
	import Overlay from "../overlay/Overlay.svelte";
	import { createEventDispatcher } from "svelte";

	export let isOpen = false;
	export let data: AdminCustomerResponse;
	export let admin = false;

	const storage = getStorage();
	let imgSrc = "";

	$: if (data) {
		imgSrc = "";
		getDownloadURL(ref(storage, data.idCardImage))
			.then((src) => (imgSrc = src))
			.catch(() => (imgSrc = "error"));
	}

	const dispatch = createEventDispatcher();

	let imageLoaded = false;
</script>

<Overlay class="flex flex-col items-center justify-center" bind:isOpen>
	<Dialog class="w-full max-w-xl" on:close={() => (isOpen = false)}>
		<svelte:fragment slot="title">
			@{data.user.username}
		</svelte:fragment>

		<div class="mt-4 px-2 flex flex-col gap-4">
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Username</div>
				<div class="text-xl font-semibold">
					@{data.user.username}
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Fullname</div>
				<div class="text-lg font-semibold">
					{data.fullname}
				</div>
			</div>
			{#if data.status === "verified"}
				<div>
					<div class="uppercase font-bold text-sm text-slate-500">Balance</div>
					<div class="flex text-xl font-mono">
						<div
							class="p-2 rounded-sm text-white break-words
							{data.balance > 0 ? 'bg-emerald-600' : 'bg-rose-500'}
						"
						>
							{idrFormat(data.balance)}
						</div>
					</div>
				</div>
			{/if}
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Status</div>
				<div class="text-lg font-semibold capitalize">
					{data.status}
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">
					Registered on
				</div>
				<div class="text-lg font-semibold capitalize">
					{data.created}
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">ID Card</div>
				<div>
					<div class="w-full h-72 mx-auto flex items-center justify-center">
						<Image
							src={imgSrc}
							alt="ID Card of {data.fullname}"
							class="w-auto h-full mx-auto"
							bind:loaded={imageLoaded}
						>
							<Spin class="h-16 w-16 absolute" />
						</Image>
					</div>
				</div>
			</div>
		</div>

		<div class="px-2">
			<!-- <table class="w-full">
				<tr>
					<td>Username</td>
					<td>@{data.user.username}</td>
				</tr>
				<tr>
					<td>Fullname</td>
					<td>{data.fullname}</td>
				</tr>
				{#if admin}
					<tr>
						<td>Balance</td>
						<td>{data.status === "verified" ? idrFormat(data.balance) : "-"}</td>
					</tr>
					<tr>
						<td>Created</td>
						<td>{data.created}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>{data.status}</td>
					</tr>
					<tr>
						<td colspan="2">ID Card</td>
					</tr>
					<tr>
						<td colspan="2" class="text-center py-4">
							<div class="w-full h-72 mx-auto flex items-center justify-center">
								<Image
									src={imgSrc}
									alt="ID Card of {data.fullname}"
									class="w-auto h-full mx-auto"
									bind:loaded={imageLoaded}
								>
									<Spin class="h-16 w-16 absolute" />
								</Image>
							</div>
						</td>
					</tr>
				{/if}
			</table> -->
		</div>

		<svelte:fragment slot="actions">
			{#if admin && data.status === "unverified"}
				<button
					class="primary w-full"
					on:click={() => dispatch("verify", data)}
					disabled={!imageLoaded}
				>
					Verify
				</button>
			{/if}
		</svelte:fragment>
	</Dialog>
</Overlay>
