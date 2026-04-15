<template>
  <div class="page-wrapper with-navbar">
    <nav class="navbar">
      <div class="navbar-content">
        <router-link class="navbar-brand" to="/">Library</router-link>
      </div>

      <div class="navbar-content ml-auto">
        <router-link class="nav-link" to="/types">Types</router-link>
        <router-link class="nav-link" to="/series">Series</router-link>
        <router-link class="nav-link" to="/lendings">Lendings</router-link>

        <!-- Dark/Light toggle -->
        <button class="btn btn-action ml-10" @click="toggleTheme">
          <i class="fa fa-adjust"></i>
        </button>
      </div>
    </nav>

    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
function toggleTheme() {
  halfmoon.toggleDarkMode()
}
</script>

<style>
.content-wrapper {
  padding: 1rem;
}
</style>
