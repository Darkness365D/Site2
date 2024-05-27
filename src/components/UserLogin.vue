<template>
  <div class="login-form">
    <h1>Вход</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="phoneNumber">Номер телефона:</label>
        <input type="text" id="phoneNumber" v-model="phoneNumber" required>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Войти</button>
      <button type="button" @click="resetForm">Сбросить</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      phoneNumber: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          phoneNumber: this.phoneNumber,
          password: this.password
        });
        const token = response.data.token;
        localStorage.setItem('token', token); // Сохранение токена в localStorage
        this.$router.push('/dashboard'); // Перенаправление на защищенный маршрут
      } catch (error) {
        console.error('Ошибка при входе:', error);
      }
    },
    resetForm() {
      this.phoneNumber = '';
      this.password = '';
    }
  }
};
</script>

<style src="@/styles/global.css" scoped>
</style>