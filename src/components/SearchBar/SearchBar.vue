<script setup lang="ts">
import { ref, watch } from 'vue'
import SearchIcon from '@/assets/Search.svg'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'update:value', value: string): void
}>()

const localSearchQuery = ref(props.value)

watch(
  () => props.value,
  (newValue) => {
    localSearchQuery.value = newValue
  },
)

const handleInput = () => {
  emit('update:value', localSearchQuery.value)
  emit('search', localSearchQuery.value)
}
</script>

<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <img :src="SearchIcon" alt="Search" class="search-icon" />
      <input type="text" v-model="localSearchQuery" @input="handleInput" placeholder="Search" />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 20px;
  padding: 0 20px;
}
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 10px;
  width: 20px;
  height: 20px;
}
.search-input-wrapper input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
