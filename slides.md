---
theme: seriph
download: true
highlighter: shiki
lineNumbers: true
---

# 从 Vue2 到 Vue3 / React

吴睿

[Repo](https://github.com/modyqyw/vue2-to-vue3-or-react)

Powered by [Slidev](https://sli.dev/)

---

# 目录

- 从 Vue2 到 Vue3
  - 1⃣️ 升级到未来的主流搭配
  - 2⃣️ 避免污染
  - 3⃣️ 简单理解新的响应式系统
  - 4⃣️ 常用库
  - 5⃣️ 注意兼容性
- 从 Vue2 到 React
  - 1⃣️ 转变你的思维和基本做法
  - 2⃣️ 了解 JSX，JS 的拓展语法
  - 3⃣️ 新的心智模型，简单理解 hooks
  - 4⃣️ 常用库

---

# 从 Vue2 到 Vue3

1⃣️ 升级到未来的主流搭配

- 升级 Vue2 到最新版本，尽量减少编译警告提示
- javascript -> [typescript](https://www.typescriptlang.org/)：类型提示，减少编译时错误
- vetur -> [volar](https://github.com/johnsoncodehk/volar)：同时支持 Vue2 和 Vue3，有更好的 TS 支持，但对在 Vue3 已经废弃的特性支持不太好
- vuex -> [pinia](https://pinia.esm.dev/)：同时支持 Vue2 和 Vue3，有更好的 TS 支持
- vue-cli -> [vite](https://cn.vitejs.dev/)：快
- [@vue/composition-api](https://github.com/vuejs/composition-api) - 支持 Composition API
- [unplugin-vue2-script-setup](https://github.com/antfu/unplugin-vue2-script-setup) - 支持 `<script setup></script>`

以上可以分步升级，不会带来严重的破坏性影响。

---

# 从 Vue2 到 Vue3

2⃣️ 避免污染

- 可能污染 this 的用法
  - mixins
  - extends
  - Vue.prototype.$http
  - app.config.globalProperties (Vue3)
  - ...
- 可能污染 this，就会导致因冲突而出现问题概率增大，同时调试也更困难。函数式编程是更好的选择
- 确实要用，应该要把所有注册的全局变量放在一个独立的文件/文件夹做管理

---

# 从 Vue2 到 Vue3

3⃣️ 简单理解新的响应式系统

- [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) -> [Proxy](https://es6.ruanyifeng.com/#docs/proxy)、[Reflect](https://es6.ruanyifeng.com/#docs/reflect)
- Proxy 是一个对象，它包装了另一个对象，并允许你拦截对该对象的任何交互
- Reflect 解决了使用 Proxy 时的 this 绑定问题
- 原理：按引用传递、借助 Proxy 和 Reflect 做监听

<img class="w-1/2" src="https://blog.penjee.com/wp-content/uploads/2015/02/pass-by-reference-vs-pass-by-value-animation.gif" alt="ref" title="ref">

---

# 从 Vue2 到 Vue3

3⃣️ 简单理解新的响应式系统 Demo1

Options API

<div class="flex flex-col">

<Demo1OptionsAPI />

```vue
<template>
  <ul class="flex flex-row">
    <li class="list-none">{{ now }}</li>
    <li class="list-none">
      <input type="checkbox" v-model="isAllChecked" />
      <span>{{ isAllChecked ? '全不选' : '全选' }}</span>
    </li>
    <li v-for="item of array" :key="item.id" class="list-none">
      <input type="checkbox" v-model="item.isChecked" />
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
          isChecked: this.isAllChecked ? false : true,
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
```

</div>

---

# 从 Vue2 到 Vue3

3⃣️ 简单理解新的响应式系统 Demo2

Composition API

<div class="flex flex-col">

<Demo2CompositionAPI />

```vue
<template>
  <ul class="flex flex-row">
    <li class="list-none">{{ now }}</li>
    <li class="list-none">
      <input type="checkbox" v-model="isAllChecked" />
      <span>{{ isAllChecked ? '全不选' : '全选' }}</span>
    </li>
    <li v-for="item of array" :key="item.id" class="list-none">
      <input type="checkbox" v-model="item.isChecked" />
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
      ...array.map((item) => ({ ...item, isChecked: isAllChecked ? false : true })),
    );
  },
});
setInterval(() => {
  now.value = new Date().toLocaleString();
}, 1000);
</script>
```

</div>

---

# 从 Vue2 到 Vue3

3⃣️ 简单理解新的响应式系统 Demo3

Composition API & Ref Sugar

<div class="flex flex-col">

<Demo3RefSugar />

```vue
<template>
  <ul class="flex flex-row">
    <li class="list-none">{{ now }}</li>
    <li class="list-none">
      <input type="checkbox" v-model="isAllChecked" />
      <span>{{ isAllChecked ? '全不选' : '全选' }}</span>
    </li>
    <li v-for="item of array" :key="item.id" class="list-none">
      <input type="checkbox" v-model="item.isChecked" />
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
let now = $(ref(new Date().toLocaleString()));
let isAllChecked = $(
  computed({
    get: () => array.every((item) => item.isChecked),
    set: () => {
      array.splice(
        0,
        array.length,
        ...array.map((item) => ({ ...item, isChecked: isAllChecked ? false : true })),
      );
    },
  }),
);
setInterval(() => {
  now = new Date().toLocaleString();
}, 1000);
</script>
```

</div>

---

# 从 Vue2 到 Vue3

3⃣️ 简单理解新的响应式系统 参考

- reactive、toRaw、ref、unRef、toRef、toRefs、computed、watch、watchEffect……
- [Composition API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html)
- [深入响应式原理](https://v3.cn.vuejs.org/guide/reactivity.html)
- [响应式 API](https://v3.cn.vuejs.org/api/reactivity-api.html)
- [从 vue2 迁移](https://v3.cn.vuejs.org/guide/migration/introduction.html)

---

# 从 Vue2 到 Vue3

4⃣️ 常用库

- [lodash](https://lodash.com/)、[rambda](https://ramdajs.com/)、[validator](https://github.com/validatorjs/validator.js)、[axios](https://axios-http.com/zh/)、[dayjs](https://dayjs.gitee.io/zh-CN/) - 通用，避免了造轮子
- [tailwindcss](https://tailwindcss.com/)、[windicss](https://windicss.org/)、[unocss](https://github.com/antfu/unocss) - 原子化 css，项目越大，减少 css 文件体积越明显
- [react-use](https://github.com/streamich/react-use)、[ahooks](https://ahooks.js.org/zh-CN/) - React 专用的工具方法，避免了造轮子
- [vue-query](https://vue-query.vercel.app/)、[swrv](https://docs-swrv.netlify.app/) - 管理你的请求和缓存

---

# 从 Vue2 到 Vue3

5⃣️ 注意兼容性

- Vue3 使用的 Proxy 和 Reflect 无法 polyfill 和 fallback，不能运行在 IE11、iOS10-、Android 5- 等老旧浏览器/设备，[caniuse proxy](https://caniuse.com/proxy) 和 [caniuse reflect](https://caniuse.com/mdn-javascript_builtins_reflect)
- tailwind2、tailwind3、windicss3 使用的 css variables 无法 polyfill 和 fallback，不能运行在 IE11、iOS10-、Android 5- 等老旧浏览器/设备，[caniuse css variables](https://caniuse.com/css-variables)

---

# 从 Vue2 到 Vue3

总结

有兼容老旧浏览器/设备的需求时，使用 Vue2，否则考虑使用 Vue3，性能更佳。

---

# 从 Vue2 到 React

1⃣️ 转变你的思维和基本做法

- Vue 提倡 mutable，而 React 提倡 immutable
- 简单理解：对于引用类型的数据，不修改引用地址视为 mutable，修改引用地址视为 immutable
- [🤔 啥是引用类型](https://segmentfault.com/a/1190000002789651)

```ts
const array = [1, 2, 3];
const mutablePush = (element: number) => {
  array.push(element);
};
const immutablePush = (element: number) => {
  return [...array, element];
};
```

---

# 从 Vue2 到 React

2⃣️ 了解 [JSX](https://zh-hans.reactjs.org/docs/introducing-jsx.html)，JS 的拓展语法

- 变量和表达式包裹在大括号中，而不是双大括号中
  - {name}
  - {formatName(name)}
- 语法更接近 JS，使用 camelCase 定义属性名
  - class -> className
  - tabindex -> tabIndex
- 同理，没有什么特别的指令，使用 JS 语法遍历数组和对象等

```tsx
<div>
  {array.map((item) => (
    <div key={item}>{item}</div>
  ))}
</div>
```

---

# 从 Vue2 到 React

3⃣️ 新的心智模型，简单理解 hooks

Vue 组件里，每一次渲染保留了上一次渲染的 props 和 data，组件内的每一个函数（包括事件处理函数，effects，定时器或者 API 调用等等）会捕获当前的 props 和 data。

<Demo4Render />

```vue
<template>
  <div class="flex flex-row">
    <span>{{ count }}</span>
    <button class="rounded" @click="handleAdd">Add</button>
    <button class="rounded" @click="handleSetTimeoutAlert">setTimeout Alert</button>
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
```

---

# 从 Vue2 到 React

3⃣️ 新的心智模型，简单理解 hooks

React 函数组件里，每一次渲染都有这一次渲染的 props 和 state，组件内的每一个函数（包括事件处理函数，effects，定时器或者 API 调用等等）会捕获定义它们的那次渲染中的 props 和 state,而 React 类组件和 Vue 组件表现一致 [example](https://codesandbox.io/s/react-fc-usestate-7ex78)

```tsx
import { memo, useState } from 'react';

const App = memo(() => {
  const [count, setCount] = useState(0);

  const handleAdd = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleSetTimeoutAlert = () => {
    setTimeout(() => {
      window.alert(`count: ${count}`);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center py-2">
      <span>点三次 Add，然后点 SetTimeout Alert，再点两次 Add，等待弹出 count: 3</span>
      <span className="my-2">count: {count}</span>
      <div>
        <button className="rounded ml-4 border px-4 py-2" onClick={handleAdd}>
          Add
        </button>
        <button className="rounded ml-4 border px-4 py-2" onClick={handleSetTimeoutAlert}>
          setTimeout Alert
        </button>
      </div>
    </div>
  );
});

export default App;
```

---

# 从 Vue2 到 React

3⃣️ 新的心智模型，简单理解 hooks

和 computed 类似的 useMemo 和 useCallback [example](https://codesandbox.io/s/react-fc-usememo-usecallback-58pm8)

```tsx
import { useState, useMemo, useCallback, memo } from 'react';

const App = memo(() => {
  const [array, setArray] = useState([
    { id: 1, isChecked: false },
    { id: 2, isChecked: true },
    { id: 3, isChecked: false },
  ]);

  const isAllChecked = useMemo(() => {
    return array.every((item) => item.isChecked);
  }, [array]);

  const handleUpdateIsChecked = useCallback(
    (item) => {
      if (item) {
        const index = array.findIndex((el) => el.id === item.id);
        setArray((prevArray) => [
          ...prevArray.slice(0, index),
          { ...item, isChecked: !item.isChecked },
          ...prevArray.slice(index + 1),
        ]);
      } else {
        setArray((prevArray) =>
          [...prevArray].map((item) => ({
            ...item,
            isChecked: !isAllChecked,
          })),
        );
      }
    },
    [array, isAllChecked],
  );

  return (
    <ul className="flex flex-row">
      <li className="list-none">
        <input type="checkbox" checked={isAllChecked} onChange={() => handleUpdateIsChecked()} />
        <span>{isAllChecked ? '全不选' : '全选'}</span>
      </li>
      {array.map((item) => (
        <li key={item.id} className="list-none">
          <input
            type="checkbox"
            checked={item.isChecked}
            onChange={() => handleUpdateIsChecked(item)}
          />
          <span>{item.id}</span>
        </li>
      ))}
    </ul>
  );
});

export default App;
```

---

# 从 Vue2 到 React

3⃣️ 新的心智模型，简单理解 hooks

跨渲染保留数据的解决方法 useRef [example](https://codesandbox.io/s/react-fc-useref-oteq6)

```tsx
import { memo, useState, useRef } from 'react';

const App = memo(() => {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  const handleAdd = () => {
    setCount((prevCount) => prevCount + 1);
    countRef.current = countRef.current + 1;
  };

  const handleSetTimeoutAlert = () => {
    setTimeout(() => {
      window.alert(`count: ${count}`);
      window.alert(`countRef.current: ${countRef.current}`);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center py-2">
      <span>
        点三次 Add，然后点 SetTimeout Alert，再点两次 Add，等待弹出 count: 3 和 countRef.current: 5
      </span>
      <span className="my-2">count: {count}</span>
      <div>
        <button className="rounded ml-4 border px-4 py-2" onClick={handleAdd}>
          Add
        </button>
        <button className="rounded ml-4 border px-4 py-2" onClick={handleSetTimeoutAlert}>
          setTimeout Alert
        </button>
      </div>
    </div>
  );
});

export default App;
```

---

# 从 Vue2 到 React

3⃣️ 新的心智模型，简单理解 hooks 参考

- memo、useState、useMemo、useCallback、useRef、useEffect、useLayoutEffect、useReducer……
- [将 React 作为 UI 运行时](https://overreacted.io/zh-hans/react-as-a-ui-runtime/)
- [useEffect 完整指南](https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/)
- [在你写 memo 之前](https://overreacted.io/zh-hans/before-you-memo/)
- [使用 React Hooks 声明 setInterval](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/)

---

# 从 Vue2 到 React

4⃣️ 常用库

- [lodash](https://lodash.com/)、[rambda](https://ramdajs.com/)、[validator](https://github.com/validatorjs/validator.js)、[axios](https://axios-http.com/zh/)、[dayjs](https://dayjs.gitee.io/zh-CN/) - 通用，避免了造轮子
- [tailwindcss](https://tailwindcss.com/)、[windicss](https://windicss.org/)、[unocss](https://github.com/antfu/unocss) - 原子化 css，项目越大，减少 css 文件体积越明显
- [react-use](https://github.com/streamich/react-use)、[ahooks](https://ahooks.js.org/zh-CN/) - React 专用的工具方法，避免了造轮子
- [react-query](https://react-query.tanstack.com/)、[swrv](https://swr.vercel.app/zh-CN) - 管理你的请求和缓存
