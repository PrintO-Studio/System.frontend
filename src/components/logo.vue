<script setup>
import { cn } from "@/lib/utils";
</script>

<template>
  <img
    src="/logo.svg"
    alt="logo"
    :class="cn('size-16 opacity-80', $attrs.class)"
  />
</template>
