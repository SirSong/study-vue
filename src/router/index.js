import Vue from "vue";
// import VueRouter from "vue-router";
import VueRouter from "@/SRouter";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
    children: [
      {
        path: "/about/page-a",
        component: () => import("../views/PageA.vue")
      },
      {
        path: "/about/page-b",
        component: () => import("../views/PageB.vue")
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
