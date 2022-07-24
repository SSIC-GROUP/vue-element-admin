/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userComponentsRouter = {
  path: '/userComponents',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentUser',
  meta: {
    title: 'UserComponents',
    icon: 'user'
  },
  children: [
    {
      path: 'user',
      name: 'User Manage',
      component: { render(c) { return c('router-view') } }, // Parent router-view
      // component: () => import('@/views/userComponents/user/list'), // Parent router-view
      meta: { title: 'User Manage', icon: 'list' },
      redirect: '/userComponents/user/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/userComponents/user/list'),
          name: 'UserUserList',
          meta: { title: 'User List', icon: 'list' }
        },
        {
          path: 'create',
          component: () => import('@/views/userComponents/user/create'),
          name: 'UserUserCreate',
          meta: { title: 'Create User', icon: 'edit' }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/userComponents/user/edit'),
          name: 'UserUserEdit',
          meta: { title: 'Edit User', noCache: true, activeMenu: '/userComponents/user/list' },
          hidden: true
        }
      ]
    }
  ]
}

export default userComponentsRouter
