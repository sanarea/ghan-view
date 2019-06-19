// route config...
import Vue from 'vue';
import Router from 'vue-router';
import siro_route from './siro.route';
import axios from 'axios';

Vue.use(Router);

/**
 * 인증키값 관리..
 * @param {*} to 
 * @param {*} from 
 * @param {*} next 
 */
const checkAuthKey = (to, from, next) => {
  if (to.name === 'login') {
    return next();
  }
  const header = axios.defaults.headers.common.Authorization;
  const storage = sessionStorage.getItem('accessToken');

  if (!!header === false && !!storage === false) {
    console.log("error....");
    return next({
      name: 'login'
    });
  }
  if (!!header === false && !!storage === true) {
    axios.defaults.headers.common['Authorization'] = storage;
  }
  return next();
};


let router =
  new Router({
    mode: 'history',
    routes: siro_route
  });
router.beforeEach((to, from, next) => {
  return checkAuthKey(to, from, next);
  // next();
});
export default router;
