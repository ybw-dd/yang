<template>
  <div class="app">
    <h1>杨博伟</h1>
    <TodoList />
  </div>
</template>

<script setup>
import TodoList from './components/TodoList.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #f5f5f5;
  color: #333;
}
.app {
  max-width: 500px;
  margin: 60px auto;
  padding: 0 20px;
}
h1 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
}
</style>
