<script setup>
import { cn } from "@/lib/utils";
</script>

<template>
  <img
    src="/logo@0,25x.webp"
    alt="logo"
    :class="cn('w-16 opacity-80', $attrs.class)"
  />
</template>
