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
      <!-- Добавьте элементы нижнего меню здесь -->
      <p></p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: null
    };
  },
  created() {
    this.fetchUser();
  },
  computed: {
    greeting() {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return 'Доброе утро';
      } else if (currentHour < 18) {
        return 'Добрый день';
      } else {
        return 'Добрый вечер';
      }
    }
  },
  methods: {
    fetchUser() {
      const token = localStorage.getItem('token'); // Предполагается, что токен хранится в localStorage
      axios.get('http://localhost:3000/me', {
        headers: {
          'Authorization': token
        }
      })
      .then(response => {
        this.user = response.data;
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        // Обработка ошибок
        if (error.response && error.response.status === 401) {
          // Если ошибка 401, возможно, нужно перенаправить на страницу логина
          this.$router.push('/login');
        } else if (error.response && error.response.status === 404) {
          console.error('User not found');
        }
      });
    }
  }
};
</script>

<style src="@/styles/global.css" scoped>
</style>
