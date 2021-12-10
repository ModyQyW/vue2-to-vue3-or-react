<template>
  <ul class="flex flex-row">
    <li class="list-none">{{ now }}</li>
    <li class="list-none">
      <input v-model="isAllChecked" type="checkbox" />
      <span>{{ isAllChecked ? '全不选' : '全选' }}</span>
    </li>
    <li v-for="item of array" :key="item.id" class="list-none">
      <input v-model="item.isChecked" type="checkbox" />
      <span>{{ item.id }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'; // vue3
// import { ref, reactive, computed } from '@vue/composition-api'; // vue2 + composition-api

const array = reactive([
  { id: 1, isChecked: false },
  { id: 2, isChecked: true },
  { id: 3, isChecked: false },
]);
const now = ref(new Date().toLocaleString());
const isAllChecked = computed({
  get: () => array.every((item) => item.isChecked),
  set: () => {
    array.splice(
      0,
      array.length,
      ...array.map((item) => ({ ...item, isChecked: !isAllChecked.value })),
    );
  },
});
setInterval(() => {
  now.value = new Date().toLocaleString();
}, 1000);
</script>
