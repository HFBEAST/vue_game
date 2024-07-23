import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
    path: '/',
    name: 'test',
    component: () => import('@/views/TestPage.vue'),
    meta: { title: 'test' }
  },
  {
    path: '/userlist',
    name: 'userlist',
    component: () => import('@/views/UserInfo.vue'),
    meta: { title: 'User Info' }
  },
  {
    path: '/questionlist',
    name: 'questionlist',
    component: () => import('@/views/QuestionList.vue'),
    meta: { title: 'Question List' }
  },
  {
    path: '/answerlist',
    name: 'answerlist',
    component: () => import('@/views/AnswerList.vue'),
    meta: { title: 'Answer List' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashBoard.vue'),
    meta: { title: 'Dashboard' }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Vue App';
  next();
});

export default router;
