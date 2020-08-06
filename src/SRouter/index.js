/**
 * Vue.use(VueRouter)
 * const router = new VueRouter({
 *  routes: []
 * })
 * new Vue({
 *  router
 * })
 * 1. 创建VueRouter class类
 *  1.1
 * 2. VueRouter添加install 方法 (vue.use)
 *  2.1
 */

let _Vue;

class VueRouter {
  constructor(options) {
    // 获取route的配置参数：先只有routes
    this.$options = options;
    // 获取path 和 comp 对应的map
    this.initialPath = window.location.hash.slice(1) || "/";
    // 讲当前的path 用current记录
    _Vue.util.defineReactive(this, "current", this.initialPath);
    _Vue.util.defineReactive(this, "matched", []);
    this.routeMap = {};

    this.mapRoute(this.$options.routes);

    this.matchedRouter(this.initialPath);
    this.route = {};
    window.addEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    // hash 去除# 当mode = history时候呢 location.path ? TODO:
    this.current = window.location.hash.slice(1) || "/";
    this.matched = [];
    this.matchedRouter(this.current);
  }

  mapRoute(routesMap, parent = null) {
    routesMap.forEach(route => {
      this.routeMap[route.path] = { ...route, parent };
      route.children && this.mapRoute(route.children, route);
    });
  }

  matchedRouter(path) {
    const currentRoute = this.routeMap[path];
    this.matched.unshift(currentRoute);
    if (currentRoute.parent) {
      this.matchedRouter(currentRoute.parent.path);
    }
  }
}

VueRouter.install = function(Vue) {
  _Vue = Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
        Vue.prototype.$route = this.$options.router.current;
      }
    }
  });

  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        default: "/"
      }
    },
    render(h) {
      return h("a", { attrs: { href: `#${this.to}` } }, this.$slots.default);
    }
  });

  Vue.component("router-view", {
    render(h) {
      this.routerView = true
      this.tmp = 0
      // vue-router 是 给 $vnode加上 routerView 作为router-view的标识
      // 放到data里面也是可以的
      // Q: 为甚这里要绑定到$vnode上,才有用 直接this.routerView 好像不行
      // Q: 还有除了深度检查的方式 来render 对应的comp吗？
      // T: 区分router-view 用path key 可行否》？
      let depth = 0;
      let parent = this.$parent;
      while (parent) {
        if (parent.routerView) {
          depth++;
        }
        parent = parent.$parent;
      }
      this.tmp = depth
      const { matched } = this.$router;
      const currentRoute = matched[this.tmp];
      console.log(matched, 'render router-view')
      const comp = currentRoute ? currentRoute.component : null;
      // console.log(comp)
      return h(comp);
    }
  });
};

export default VueRouter;
