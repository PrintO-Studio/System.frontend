<script>
export default {
  components: {},
  props: {
    oldSKU: String,
    newSKU: String,
  },
};
</script>

<template>
  <div class="flex flex-col items-center">
    <h>
      {{ newSKU }}
    </h>
    <h class="text-muted-foreground text-sm">
      {{ oldSKU }}
    </h>
  </div>
</template>
