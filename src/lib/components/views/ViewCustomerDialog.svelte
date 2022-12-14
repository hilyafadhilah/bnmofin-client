<script lang="ts">
	import { getStorage, ref, getDownloadURL } from "firebase/storage";
	import type { AdminCustomerResponse } from "$models/customer";
	import Image from "../data/Image.svelte";
	import Spin from "../icons/Spin.svelte";

	import Dialog from "../overlay/Dialog.svelte";
	import Overlay from "../overlay/Overlay.svelte";
	import { createEventDispatcher } from "svelte";
	import Money from "../data/Money.svelte";
	import DateCreated from "../data/DateCreated.svelte";

	export let isOpen = false;
	export let customer: AdminCustomerResponse;
	export let admin = false;

	const storage = getStorage();
	let imgSrc = "";

	$: if (customer) {
		imgSrc = "";
		getDownloadURL(ref(storage, customer.idCardImage))
			.then((src) => (imgSrc = src))
			.catch(() => (imgSrc = "error"));
	}

	const dispatch = createEventDispatcher();

	let imageLoaded = false;
</script>

<Overlay class="flex flex-col items-center justify-center" bind:isOpen>
	<Dialog class="w-full max-w-xl" on:close={() => (isOpen = false)}>
		<svelte:fragment slot="title">
			@{customer.user.username}
		</svelte:fragment>

		<div class="mt-4 px-2 flex flex-col gap-4">
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Username</div>
				<div class="text-xl font-semibold">
					@{customer.user.username}
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Fullname</div>
				<div class="text-lg font-semibold">
					{customer.fullname}
				</div>
			</div>
			{#if customer.status === "verified"}
				<div>
					<div class="uppercase font-bold text-sm text-slate-500">Balance</div>
					<div class="flex text-xl font-mono">
						<Money amount={customer.balance} />
					</div>
				</div>
			{/if}
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">Status</div>
				<div class="text-lg font-semibold capitalize">
					{customer.status}
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">
					Registered on
				</div>
				<div class="text-lg font-semibold capitalize">
					<DateCreated date={new Date(customer.created)} />
				</div>
			</div>
			<div>
				<div class="uppercase font-bold text-sm text-slate-500">ID Card</div>
				<div>
					<div class="w-full h-72 mx-auto flex items-center justify-center">
						<Image
							src={imgSrc}
							alt="ID Card of {customer.fullname}"
							class="w-auto h-full mx-auto"
							bind:loaded={imageLoaded}
						>
							<Spin class="h-16 w-16 absolute" />
						</Image>
					</div>
				</div>
			</div>
		</div>

		<svelte:fragment slot="actions">
			{#if admin && customer.status === "unverified"}
				<button
					class="primary w-full"
					on:click={() => dispatch("verify", customer)}
					disabled={!imageLoaded}
				>
					Verify
				</button>
			{/if}
		</svelte:fragment>
	</Dialog>
</Overlay>
