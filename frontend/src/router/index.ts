import { createRouter, createWebHistory } from 'vue-router'
import BookTypeList from '../pages/BookTypes/BookTypeList.vue'
import BookTypeForm from '../pages/BookTypes/BookTypeForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/types', component: BookTypeList },
    { path: '/types/new', component: BookTypeForm },
    { path: '/types/:id', component: BookTypeForm },
  ],
})

export default router
