<template>
  <div class="osnovnoe" style="background-color: #3C3B3B;">
    <div class="top-menu">
      <div class="name" align="left">
        BanK
        <img src="@/assets/naz.png" align="center">
      </div>
      <nav class="menu">
        <router-link to="/DashBoard">Главная</router-link>
        <router-link to="/transferFromTo">Операции</router-link>
        <router-link to="/payments">Платежи</router-link>
      </nav>
      <div class="user-name" v-if="user">
        <p style="padding-right: 6%;">{{ user.name }}</p>
        <img src="@/assets/Frame 11.png" align="center">
      </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <div class="text" style="padding-left: 5%" v-if="user">
      {{ greeting }} {{ user.name }}
    </div>
    <div class="card-form" v-if="user">
      <img src="@/assets/f7_money-rubl-circle-fill.png">
      <p style="padding-left: 50%;">{{ user.Balance }} ₽</p>
    </div>
    <router-link to="/transferFromTo" class="button">Перевести</router-link>
    <div class="bottom-menu">
      <p></p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['user']),
    greeting() {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Доброе утро,';
      } else if (currentHour < 18) {
        return 'Добрый день,';
      } else {
        return 'Добрый вечер,';
      }
    }
  },
  created() {
    this.$store.dispatch('fetchUser');
  }
};
</script>

<style src="@/styles/global.css" scoped>
</style>
