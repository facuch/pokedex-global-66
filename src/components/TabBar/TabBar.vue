<script lang="ts" setup>
import { ref } from 'vue'
import ButtonComponent from '../Button/ButtonComponent.vue'
import StarIcon from '@/assets/Star.svg'
import ListIcon from '@/assets/List.svg'

interface TabBarProps {
  onTabChange: (tab: 'all' | 'favorites') => void
}

const props = defineProps<TabBarProps>()

const activeTab = ref<'all' | 'favorites'>('all')

const changeTab = (tab: 'all' | 'favorites') => {
  activeTab.value = tab
  props.onTabChange(tab)
}
</script>

<template>
  <div class="tabbar-container">
    <div class="tabbar">
      <ButtonComponent
        :icon="ListIcon"
        :class="{ active: activeTab === 'all' }"
        :disabled="activeTab === 'favorites'"
        @click="changeTab('all')"
        text="All Pokémon"
        :tabBar="true"
      />
      <ButtonComponent
        :icon="StarIcon"
        :class="{ active: activeTab === 'favorites' }"
        :disabled="activeTab === 'all'"
        @click="changeTab('favorites')"
        text="Favorites"
        :tabBar="true"
      />
    </div>
  </div>
</template>

<style scoped>
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: var(--white, #ffffff);
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.tabbar {
  height: 60px;
  max-width: 570px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.tab-button {
  flex: 1;
  height: 100%;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color, #333333);
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
