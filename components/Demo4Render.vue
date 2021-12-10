<template>
  <div class="flex flex-col items-center py-2">
    <span>点三次 Add，然后点 SetTimeout Alert，再点两次 Add，等待弹出 count: 5</span>
    <span class="my-2">count: {{ count }}</span>
    <div>
      <button class="rounded ml-4 border px-4 py-2" @click="handleAdd">Add</button>
      <button class="rounded ml-4 border px-4 py-2" @click="handleSetTimeoutAlert">
        setTimeout Alert
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

let count = $(ref(0));
const handleAdd = () => {
  count += 1;
};
const handleSetTimeoutAlert = () => {
  setTimeout(() => {
    window.alert(`count: ${count}`);
  }, 3000);
};
</script>
