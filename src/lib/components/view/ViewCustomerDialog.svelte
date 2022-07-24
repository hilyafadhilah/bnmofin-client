<script lang="ts">
	import { getStorage, ref, getDownloadURL } from "firebase/storage";
	import type { AdminCustomerResponse } from "$lib/models/customer";
	import { idrFormat } from "$lib/utils/data";
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
		getDownloadURL(ref(storage, data.idCardImage)).then(
			(src) => (imgSrc = src)
		);
	}

	const dispatch = createEventDispatcher();
</script>

<Overlay class="flex flex-col items-center justify-center" bind:isOpen>
	<Dialog class="w-full max-w-xl" on:close={() => (isOpen = false)}>
		<svelte:fragment slot="title">
			{data.user.username}
		</svelte:fragment>

		<div class="px-2">
			<table class="w-full">
				<tr>
					<td>Username</td>
					<td>{data.user.username}</td>
				</tr>
				<tr>
					<td>Fullname</td>
					<td>{data.fullname}</td>
				</tr>
				{#if admin}
					<tr>
						<td>Balance</td>
						<td>{idrFormat(data.balance)}</td>
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
								>
									<Spin class="h-16 w-16 absolute" />
								</Image>
							</div>
						</td>
					</tr>
				{/if}
			</table>
		</div>

		<svelte:fragment slot="actions">
			{#if admin && data.status === "unverified"}
				<button
					class="primary w-full"
					on:click={() => dispatch("verify", data)}
				>
					Verify
				</button>
			{/if}
		</svelte:fragment>
	</Dialog>
</Overlay>
