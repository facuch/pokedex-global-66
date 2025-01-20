<script setup lang="ts">
import ButtonComponent from '@/components/Button/ButtonComponent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = 'Welcome to Pokédex'
const subtitle =
  'The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.'

const click = () => {
  router.push('/search')
}
</script>

<template>
  <div class="welcome">
    <img src="@/assets/pikachu.png" alt="Pikachu" class="pikachu-img" />
    <span class="title">{{ message }}</span>
    <span class="subtitle">{{ subtitle }}</span>
    <ButtonComponent text="Get Started" :onClick="click" :disabled="false" />
  </div>
</template>

<style lang="css" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.subtitle {
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  color: var(--font-grey);
  margin-top: 10px;
  margin-bottom: 30px;
}
.title {
  font-weight: 700;
  font-size: 26px;
  line-height: 32px;
  margin: 10px 0;
}
</style>
