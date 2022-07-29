<script lang="ts">
	import lightFormat from "date-fns/lightFormat/index";

	export let date: Date;
</script>

{lightFormat(date, "y/M/d H:mm")}
