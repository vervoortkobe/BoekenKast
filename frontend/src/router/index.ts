import { createRouter, createWebHistory } from 'vue-router'
import BookTypeList from '../pages/BookTypes/BookTypeList.vue'
import BookTypeBooks from '../pages/BookTypes/BookTypeBooks.vue'
import SeriesList from '../pages/Series/SeriesList.vue'
import SeriesBooks from '../pages/Series/SeriesBooks.vue'
import LendingsList from '../pages/Lendings/LendingsList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/types' },
    { path: '/types', component: BookTypeList },
    { path: '/types/:id/books', component: BookTypeBooks },
    { path: '/series', component: SeriesList },
    { path: '/series/:id/books', component: SeriesBooks },
    { path: '/lendings', component: LendingsList },
  ],
})

export default router
