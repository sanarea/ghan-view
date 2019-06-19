// import HelloWorld from '@/components/HelloWorld'
import Login from '@/pages/login/login.vue';
import Home from '@/pages/home.vue';

import Table from '@/pages/Table.vue';
import Detail from '@/pages/Detail.vue';


var siro_route = [{
  path: '/',
  name: 'Home',
  component: Home
}, {
  path: '/',
  name: 'Dashboard',
  component: Home
}, {
  path: '/login',
  name: 'login',
  component: Login,
  meta: {
    public: true,
    allowAnonymous: false,
    direct: true
  }
}, {
  path: '/table/:objNm/:page?',
  meta: {
    breadcrumb: true
  },
  name: 'components/tables',
  props: true,
  component: Table
}, {
  path: '/detail/:objNm/:objKey',
  meta: {
    breadcrumb: true,
    detail: 'view'
  },
  name: 'components/detail',
  props: true,
  component: Detail,

}, {
  path: '/edit/:objNm/:objKey',
  meta: {
    breadcrumb: true,
    detail: 'edit'
  },
  name: 'components/edit',
  props: true,
  component: Detail
}, {
  path: '/new/:objNm',
  meta: {
    breadcrumb: true,
    detail: 'new'
  },
  name: 'components/new',
  props: true,
  component: Detail
}];

export default siro_route;
