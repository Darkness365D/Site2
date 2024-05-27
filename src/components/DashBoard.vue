<template>
  <div>
    <h1>User Dashboard</h1>
    <div v-if="user">
      <p>Name: {{ user.name }}</p>
      <p>Surname: {{ user.surname }}</p>
      <p>Phone Number: {{ user.phoneNumber }}</p>
      <!-- Выведите другие данные пользователя, если нужно -->
    </div>
    <div v-else>
      <p>Loading...</p>
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