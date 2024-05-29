<template>
  <div style="background-color: #3C3B3B;">
     <div class="top-menu">
       <div class="name" align="left" >
        <span>
        BanK
        <img src="@/assets/naz.png" align="center">
        </span>
      </div>
    <nav class="menu">
        <a href="#glavnaya">Главная</a>
        <a href="#">Операции</a>
        <a href="#">Платежи</a>
    </nav>
      <div class="user-name" v-if="user">
        <span>
         {{ user.name }}
              <img src="@/assets/Frame 11.png" align="center">
        </span>
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
    <div class="text" >
    Добрый день
    </div>
    <div class="card-form" v-if="user">
        <img src="@/assets/f7_money-rubl-circle-fill.png">
        <p style="padding-left: 50%;">{{ user.Balance }}</p>
    </div>
    <button>Перевести</button>
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