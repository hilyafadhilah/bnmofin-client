<script lang="ts" context="module">
	import { api } from "$lib/services/api";

	import type { Load } from "@sveltejs/kit";

	export const load: Load = ({ session }) => {
		return {
			stuff: { title: "Customers" },
			props: {
				customers: api.get<AdminCustomerResponse[]>("/customer", {
					auth: session.auth,
				}),
			},
		};
	};
</script>

<script lang="ts">
	import { getStorage, ref, getDownloadURL } from "firebase/storage";
	import type { AdminCustomerResponse } from "$lib/models/customer";
	import Spin from "$lib/components/icons/Spin.svelte";
	import Overlay from "$lib/components/overlay/Overlay.svelte";
	import ConfirmDialog from "$lib/components/overlay/ConfirmDialog.svelte";
	import { AppError } from "$lib/models/error";
	import { session } from "$app/stores";

	export let customers: Promise<AdminCustomerResponse[]>;

	const reload = () => {
		customers = api.get<AdminCustomerResponse[]>("/customer", {
			auth: $session.auth,
		});
	};

	let selected: AdminCustomerResponse | null = null;

	// image

	const storage = getStorage();

	let showImage = false;
	let src: string;
	let imgLoaded = false;

	const loadImage = async (customer: AdminCustomerResponse) => {
		selected = customer;
		showImage = true;
		src = await getDownloadURL(ref(storage, customer.idCardImage));
	};

	$: if (!showImage) {
		src = "";
		imgLoaded = false;
	}

	// verify

	let showConfirm = false;
	let confirmLoading = false;

	const confirmVerify = () => {
		showConfirm = true;
	};

	const verify = async () => {
		if (selected) {
			try {
				confirmLoading = true;
				await api.send(`/customer/${selected.userId}/verify`, {
					method: "put",
					auth: $session.auth,
				});
				reload();
			} catch (err) {
				console.log(new AppError(err));
			} finally {
				confirmLoading = false;
				showConfirm = false;
				showImage = false;
			}
		}
	};
</script>

{#await customers}
	<Spin class="h-24 w-24" />
{:then customers}
	<table>
		<thead>
			<tr>
				<th>Username</th>
				<th>Fullname</th>
				<th />
				<th />
			</tr>
		</thead>
		<tbody>
			{#each customers as customer}
				<tr>
					<td>{customer.user.username}</td>
					<td>{customer.fullname}</td>
					<td>
						<button class="primary" on:click={() => loadImage(customer)}
							>View ID Card</button
						>
					</td>
					<td>
						{#if customer.status === "verified"}
							<button class="primary w-full" disabled> Verified </button>
						{:else}
							<button
								class="primary w-full"
								on:click={() => loadImage(customer)}
							>
								Verify
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- View Image -->
	<Overlay
		class="flex flex-col items-center justify-center"
		bind:isOpen={showImage}
	>
		{#if !imgLoaded}
			<Spin class="text-white h-24 w-24 absolute" />
		{/if}
		<div class="w-fit">
			<img
				{src}
				on:load={() => (imgLoaded = true)}
				alt=""
				class="max-w-xl max-h-96"
				style:min-width="248px"
			/>
			{#if imgLoaded && selected?.status === "unverified"}
				<button class="primary w-full mt-2" on:click={() => confirmVerify()}>
					Verify
				</button>
			{/if}
		</div>
	</Overlay>

	<!-- Confirm verify -->
	<ConfirmDialog
		bind:isOpen={showConfirm}
		loading={confirmLoading}
		on:confirm={verify}
	>
		<div class="flex flex-col text-center">
			<div>
				You are about to verify <strong>{selected?.fullname}</strong>.
			</div>
			<div>Once you verify, you cannot unverify.</div>
		</div>
	</ConfirmDialog>
{/await}
