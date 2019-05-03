import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Books from './views/Books.vue'
import Book from './views/Book.vue'
import BookPart from './views/BookPart.vue'
import Words from './views/Words.vue'
import Profile from './views/Profile.vue'
import Signin from './views/Signin.vue'
import Signup from './views/Signup.vue'
import Store from './store'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/books',
      name: 'books',
      component: Books
    },
    {
      path: '/book/:id',
      name: 'book',
      props: true,
      component: Book
    },
    {
      path: '/book/:bookId/part/:partId',
      name: 'bookPart',
      props: true,
      component: BookPart
    },
    {
      path: '/words',
      name: 'words',
      component: Words
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { authRequired: true }
    },
    {
      path: '/signin',
      name: 'signin',
      component: Signin
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
  ]
})

router.beforeEach((to, from, next) => {
  Store.dispatch('INIT_AUTH')
  .then(user => {
	if(to.matched.some(route => route.meta.authRequired))
	{
		if(user)
		next()
		else
		next('/signin')
	}else{
		next()
	}
  })
})


export default router