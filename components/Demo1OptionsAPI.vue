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

<script lang="ts">
export default {
  data: () => ({
    array: [
      { id: 1, isChecked: false },
      { id: 2, isChecked: true },
      { id: 3, isChecked: false },
    ],
    now: new Date().toLocaleString(),
  }),
  computed: {
    isAllChecked: {
      get() {
        return this.array.every((item) => item.isChecked);
      },
      set() {
        this.array = this.array.map((item) => ({
          ...item,
          isChecked: !this.isAllChecked,
        }));
      },
    },
  },
  mounted() {
    setInterval(() => {
      this.now = new Date().toLocaleString();
    }, 1000);
  },
};
</script>
