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
      <h2>Перевод средств</h2>
      <form @submit.prevent="transferMoney">
        <label>Номер телефона получателя:</label>
        <input type="text" v-model="phoneNumber" required>
        <label>Сумма:</label>
        <input type="number" v-model="amount" required>
        <button type="submit">Отправить</button>
      </form>
    </div>
    <div class="bottom-menu">
      <!-- Добавьте элементы нижнего меню здесь -->
      <p></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        phoneNumber: '',
        amount: 0
      };
    },
    methods: {
      transferMoney() {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:3000/transferFromTo', {
          phoneNumber: this.phoneNumber,
          amount: this.amount
        }, {
          headers: {
            'Authorization': token
          }
        })
        .then(response => {
          alert(response.data.message); // Показать сообщение об успешном переводе
          this.$router.push('/DashBoard'); // Переход на главную страницу после успешного перевода
        })
        .catch(error => {
          console.error('Transfer error:', error);
          if (error.response && error.response.data && error.response.data.error) {
            alert(error.response.data.error);
          }
        });
      }
    }
  };
  </script>

<style src="@/styles/global.css" scoped>
</style>
  