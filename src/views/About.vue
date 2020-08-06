<template>
  <div class="about">
    <h1>This is an about page</h1>
    <router-link to="/about/page-a">PageA</router-link>
    <router-link to="/about/page-b">Pageb</router-link>
    <name />
  </div>
</template>

<script>
import Name from "@/views/Name.vue";

export default {
  components: {
    Name
  }
};
</script>
