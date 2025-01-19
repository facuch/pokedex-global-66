<script setup lang="ts">
const message = 'Welcome to Pokédex'
const subtitle =
  'The digital encyclopedia created by Professor Oak is an invaluable tool to Trainers in the Pokémon world.'
</script>

<template>
  <div class="welcome">
    <img src="@/assets/pikachu.png" alt="Pikachu" />
    <h2>{{ message }}</h2>
    <h3>{{ subtitle }}</h3>
    <button>Get Started</button>
  </div>
</template>

<style lang="css" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
