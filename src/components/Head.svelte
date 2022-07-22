<script lang="ts">
  export let title = '';
</script>

<svelte:head>
  <title>{title.length ? `${title} | ` : ''}BNMO Wallet</title>
</svelte:head>
