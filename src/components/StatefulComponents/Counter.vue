<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '../../store/counter.js';

const counterStore = useCounterStore();

const count = counterStore.count;
const increment = counterStore.increment;
const decrement = counterStore.decrement;
</script>

<style lang="scss" scoped>

</style>