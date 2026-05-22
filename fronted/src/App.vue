


<script setup lang="ts">

</script>

<template>
  <div id="app">
    <nav style="padding: 20px; background: #222; margin-bottom: 20px;">
      <router-link to="/" style="color: white; margin-right: 15px;">Главная</router-link>
      <router-link to="/profile" style="color: white; margin-right: 15px;">Личный кабинет</router-link>
      <router-link to="/admin" style="color: white;">админка</router-link>
    </nav>

    <main style="padding: 0 20px;">
      <router-view />
    </main>
  </div>
</template>

<style>
/*пока по миниммуму*/
  body{
    font-family: sans-serif;
    margin: 0;
    background-color: #1a1a1a;
    color: #ffffff;
  }
</style>
