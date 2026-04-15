<template>
  <div>
    <!-- Navbar -->
    <nav class="bk-navbar">
      <router-link class="bk-navbar-brand" to="/">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        BoekenKast
      </router-link>

      <div class="bk-nav-links">
        <router-link class="bk-nav-link" to="/types">📚 Types</router-link>
        <router-link class="bk-nav-link" to="/series">📖 Series</router-link>
        <router-link class="bk-nav-link" to="/lendings">📤 Lendings</router-link>

        <button class="bk-theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
    </nav>

    <!-- Content -->
    <div class="bk-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-bs-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('bk-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('bk-theme')
  if (saved === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else if (!saved) {
    // Detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      isDark.value = true
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    }
  }
})
</script>
