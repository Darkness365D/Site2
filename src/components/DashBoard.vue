<template>
  <div style="background-color: aqua;">
    <div class="top-menu">
      <!-- Добавьте элементы верхнего меню здесь -->
      <p>Top Menu</p>
    </div>
    
    <div class="card-form" v-if="user">
        <img src="@/assets/f7_money-rubl-circle-fill.png">
        <p style="padding-left: 50%;">{{ user.Balance }}</p>
    </div>

    <div class="bottom-menu">
      <!-- Добавьте элементы нижнего меню здесь -->
      <p>Bottom Menu</p>
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