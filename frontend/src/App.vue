<template>
  <div>
    <!-- Navbar -->
    <nav class="bk-navbar">
      <router-link class="bk-navbar-brand" to="/">
        <svg viewBox="0 0 24 24" fill="none" stroke="url(#logo-gradient)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:var(--bk-primary);stop-opacity:1" />
              <stop offset="100%" style="stop-color:#9333ea;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span class="bk-logo-text">BoekenKast</span>
      </router-link>

      <div class="bk-nav-actions">
        <div class="bk-nav-links">
          <router-link class="bk-nav-link" to="/types">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Types
          </router-link>
          <router-link class="bk-nav-link" to="/series">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Series
          </router-link>
          <router-link class="bk-nav-link" to="/lendings">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            Lendings
          </router-link>
        </div>

        <button class="bk-theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
      </div>
    </nav>

    <!-- Content -->
    <div class="bk-content">
      <router-view />
    </div>

    <!-- Decorative Waves -->
    <div class="bk-waves">
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:var(--bk-primary);stop-opacity:0.3" />
            <stop offset="100%" style="stop-color:#9333ea;stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="url(#wave-gradient)" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="url(#wave-gradient)" opacity="0.5" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="url(#wave-gradient)" opacity="0.3" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="url(#wave-gradient)" opacity="0.1" />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(true)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-bs-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('bk-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('bk-theme')
  if (saved === 'dark' || !saved) {
    isDark.value = true
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  } else if (saved === 'light') {
    isDark.value = false
    document.documentElement.setAttribute('data-bs-theme', 'light')
  }
})
</script>
