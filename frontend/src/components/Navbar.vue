<template>
  <nav class="navbar">
    <router-link to="/types">Types</router-link>
    <router-link to="/series">Series</router-link>
    <router-link to="/lendings">Lendings</router-link>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eee;
}
</style>
