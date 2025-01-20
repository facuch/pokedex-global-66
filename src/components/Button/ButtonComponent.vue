<script lang="ts" setup>
interface ButtonProps {
  text: string
  onClick: () => void
  disabled?: boolean
  icon?: string // URL de la imagen o nombre del icono
}

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
})

const handleClick = () => {
  if (!props.disabled) {
    props.onClick()
  }
}
</script>

<template>
  <div>
    <button
      :disabled="props.disabled"
      @click="handleClick"
      :class="['button', props.disabled ? 'disabled' : '']"
    >
      <img v-if="props.icon" :src="props.icon" alt="icon" class="button-icon" />
      <span class="text">{{ props.text }}</span>
    </button>
  </div>
</template>

<style scoped>
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0px solid transparent;
  border-radius: 60px;
  padding: 11px 20px;
  font-size: 16px;
  font-weight: 700;
  background-color: var(--button-red);
  color: var(--background);
}

.disabled {
  background-color: var(--placeholder);
  color: var(--background);
}

.text {
  font-weight: 700;
  font-size: 16px;
}

.button-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.button:hover {
  cursor: pointer;
}
</style>
