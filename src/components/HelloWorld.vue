<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  pantryItems: string[],
  dietRestrictions: string[],
}>()

const count = ref(0)
</script>

<template>
  <h1>hi</h1>


</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
