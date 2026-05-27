<template>
  <div class="todo-container">
    <div class="input-row">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="添加新的待办事项..."
      />
      <button @click="addTodo">添加</button>
    </div>

    <p v-if="loading" class="status">加载中...</p>
    <p v-else-if="todos.length === 0" class="status">暂无待办事项</p>

    <ul v-else class="todo-list">
      <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.completed }">
        <label>
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo)"
          />
          <span>{{ todo.title }}</span>
        </label>
        <button class="delete-btn" @click="deleteTodo(todo.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const todos = ref([]);
const newTodo = ref('');
const loading = ref(true);

async function fetchTodos() {
  const res = await fetch('/api/todos');
  todos.value = await res.json();
  loading.value = false;
}

async function addTodo() {
  const title = newTodo.value.trim();
  if (!title) return;
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  const todo = await res.json();
  todos.value.unshift(todo);
  newTodo.value = '';
}

async function toggleTodo(todo) {
  await fetch(`/api/todos/${todo.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed }),
  });
  todo.completed = !todo.completed;
}

async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  todos.value = todos.value.filter(t => t.id !== id);
}

onMounted(fetchTodos);
</script>

<style scoped>
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.input-row input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.input-row input:focus {
  border-color: #409eff;
}
.input-row button {
  padding: 10px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.input-row button:hover {
  background: #337ecc;
}
.status {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
.todo-list {
  list-style: none;
}
.todo-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.todo-list li label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}
.todo-list li.done span {
  text-decoration: line-through;
  color: #aaa;
}
.delete-btn {
  background: none;
  border: none;
  color: #f56c6c;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 8px;
}
.delete-btn:hover {
  background: #fef0f0;
  border-radius: 4px;
}
</style>
