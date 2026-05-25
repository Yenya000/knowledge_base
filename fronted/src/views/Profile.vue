<template>
  <div class="profile-layout">
    
    <div class="profile-card">
      <div class="avatar-container">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Annamiruk" alt="Avatar" class="avatar" />
      </div>
      <!-- потом вся инфа должна быть взята из таблиц  -->
      <h2>Анна (miruk-lead)</h2>
      <p class="role-badge">Team Lead / Frontend Developer</p>
      
      <hr class="divider" />
      
      <div class="user-info">
        <div class="info-item">
          <strong>Департамент:</strong> <span>IT-разработка</span>
        </div>
        <div class="info-item">
          <strong>Email:</strong> <span>teamlead@oblivion.corp</span>
        </div>
        <div class="info-item">
          <strong>Telegram:</strong> <span>@miruk_lead</span>
        </div>
        <div class="info-item">
          <strong>Дата вступления:</strong> <span>18.05.2026</span>
        </div>
      </div>
    </div>

    <div class="forms-container">
      
      <div class="form-box">
        <h3>🚀 Рационализаторское предложение</h3>
        <p class="form-desc">Поделитесь идеей, как улучшить базу знаний OBLIVION.</p>
        <form @submit.prevent="sendSuggestion">
          <textarea v-model="suggestionText" placeholder="Опишите вашу идею во всех деталях..." required></textarea>
          <button type="submit" class="btn btn-primary">Отправить идею</button>
        </form>
      </div>

      <div class="form-box">
        <h3>🔒 Конфиденциальная жалоба</h3>
        <p class="form-desc">Прямой анонимный канал для сообщения о проблемах в отделе.</p>
        <form @submit.prevent="sendComplaint">
          <textarea v-model="complaintText" placeholder="Что случилось? (Это улетит напрямую руководству)..." required></textarea>
          <button type="submit" class="btn btn-danger">Подать жалобу</button>
        </form>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const suggestionText = ref('')
const complaintText = ref('')


const sendSuggestion = () => {
  console.log('--- Отправлено предложение ---', suggestionText.value)
  alert('Ваше предложение успешно зафиксировано!')
  suggestionText.value = ''
}

const sendComplaint = () => {
  console.log('--- Отправлена жалоба ---', complaintText.value)
  alert('Жалоба отправлена. Конфиденциальность гарантирована.')
  complaintText.value = ''
}
</script>

<style scoped>
/* Сетка: делит экран на 2 колонки (1 часть под карточку, 2 части под формы) */
.profile-layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: sans-serif;
  color: #fff;
}

/* Стили карточки пользователя */
.profile-card {
  background-color: #1e1e1e;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  height: fit-content;
}

.avatar-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  background: #333;
  border-radius: 50%;
  padding: 10px;
  border: 2px solid #3b82f6;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.role-badge {
  color: #3b82f6;
  font-weight: bold;
  margin-top: 5px;
  font-size: 14px;
}

.divider {
  border: 0;
  border-top: 1px solid #333;
  margin: 20px 0;
}

.user-info {
  text-align: left;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item strong {
  color: #aaa;
}

/* Стили правой части с формами */
.forms-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-box {
  background-color: #1e1e1e;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.form-box h3 {
  margin-top: 0;
  margin-bottom: 5px;
}

.form-desc {
  color: #aaa;
  font-size: 13px;
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  height: 100px;
  background-color: #2d2d2d;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  padding: 12px;
  box-sizing: border-box;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 15px;
}

textarea:focus {
  border-color: #3b82f6;
  outline: none;
}

/* Кнопки */
.btn{
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>