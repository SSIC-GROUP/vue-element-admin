/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userComponentsRouter = {
  path: '/userComponents',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: 'Components',
    icon: 'user'
  },
  children: [
    {
      path: 'user',
      name: 'UserList',
      component: () => import('@/views/userComponents/user/list'), // Parent router-view
      meta: { title: 'User List', icon: 'list' },
      redirect: '/userComponents/user/list',
      children: [
        {
          path: 'list',
          component: () => import('@/views/userComponents/user/list'),
          name: 'UserList',
          meta: { title: 'User List', icon: 'list' }
        },
        {
          path: 'create',
          component: () => import('@/views/example/create'),
          name: 'CreateArticle',
          meta: { title: 'Create Article', icon: 'edit' }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/example/edit'),
          name: 'EditArticle',
          meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
          hidden: true
        }
      ]
    }
  ]
}

export default userComponentsRouter
