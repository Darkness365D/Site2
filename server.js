const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();

const pool = mysql.createPool({
  host: 'kolei.ru',
  user: 'nzaskupin',
  password: '230104',
  database: 'nzaskupin'
});

app.use(cors());
app.use(bodyParser.json());

const secretKey = 'ваш_секретный_ключ'; // Замените на ваш секретный ключ

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ error: 'Токен не предоставлен' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).send({ error: 'Недействительный токен' });
    req.user = user;
    next();
  });
};

// API для регистрации
app.post('/register', (req, res) => {
  const { name, phoneNumber, password, birthday, genderId, surname, patronymic } = req.body;

  if (genderId !== 1 && genderId !== 2) {
    return res.status(400).send({ error: 'Неправильное значение для пола' });
  }

  pool.query(
    'INSERT INTO KpUser (name, phoneNumber, password, birthday, genderId, surname, patronymic) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, phoneNumber, password, birthday, genderId, surname, patronymic],
    (error, results) => {
      if (error) {
        console.error('Ошибка при регистрации:', error);
        return res.status(500).send({ error: 'Что-то пошло не так при регистрации' });
      }

      const userId = results.insertId;
      const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
      const cvvCode = Math.floor(100 + Math.random() * 900).toString();
      const balance = 0; // начальный баланс

      pool.query(
        'INSERT INTO KpAccount (cardNumber, cvvCode, balance, userId) VALUES (?, ?, ?, ?)',
        [cardNumber, cvvCode, balance, userId],
        (error, accountResults) => {
          if (error) {
            console.error('Ошибка при создании счета:', error);
            return res.status(500).send({ error: 'Что-то пошло не так при создании счета' });
          }

          res.status(201).send({
            id: userId,
            name,
            phoneNumber,
            birthday,
            genderId,
            surname,
            patronymic,
            account: {
              cardNumber,
              cvvCode,
              balance
            }
          });
        }
      );
    }
  );
});

// API для входа
app.post('/login', (req, res) => {
  const { phoneNumber, password } = req.body;

  pool.query('SELECT * FROM KpUser WHERE phoneNumber = ?', [phoneNumber], (error, results) => {
    if (error) {
      console.error('Ошибка при входе:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при входе' });
    }

    if (results.length === 0) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.send({ token });
  });
});

// API для получения данных текущего пользователя (с аутентификацией)
app.get('/me', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `SELECT 
      KpUser.id, KpUser.name, KpUser.phoneNumber, KpUser.birthday, 
      KpUser.genderId, KpUser.surname, KpUser.patronymic,
      KpAccount.cardNumber, KpAccount.Balance, KpAccount.cvvCode
    FROM KpUser
    LEFT JOIN KpAccount ON KpUser.id = KpAccount.userId
    WHERE KpUser.id = ?
  `;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при получении данных' });
    }

    if (results.length === 0) {
      return res.status(404).send({ error: 'Пользователь не найден' });
    }

    const user = results[0];
    res.send(user);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
