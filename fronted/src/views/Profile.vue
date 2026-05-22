<template>
  <div class="profile-container">
    <div class="profile-card">
        //потом это все подключим данные таблиц
      <h2>Личный кабинет сотрудника</h2>
      <p><strong>Имя:</strong> Анна (Team Lead)</p>
      <p><strong>Роль в компании:</strong> Разработчик / Тимлид</p>
      <p><strong>Департамент:</strong> IT-отдел</p>
    </div>

    <div class="form-section">
      <h3>💡 Оставить предложение</h3>
      <form @submit.prevent="sendSuggestion">
        <textarea 
          v-model="suggestionText" 
          placeholder="Напишите вашу идею по улучшению компании..."
          rows="4"
        ></textarea>
        <button type="submit">Отправить идею</button>
      </form>
    </div>

    <div class="form-section">
      <h3>⚠️ Подать жалобу</h3>
      <form @submit.prevent="sendComplaint">
        <textarea 
          v-model="complaintText" 
          placeholder="Опишите проблему или жалобу конфиденциально..."
          rows="4"
        ></textarea>
        <button type="submit" class="btn-danger">Отправить жалобу</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

//реактивные переменные куда будет записываться текст из полей ввода
const suggestionText = ref('')
const complaintText = ref('')

// функция "Отправить идею"
const sendSuggestion = () => {
  console.log('--- Новое предложение ---')
  console.log(suggestionText.value)
  
  alert('Предложение успешно отправлено (проверь консоль)!')
  suggestionText.value = ''  // очиска поля после отправки
}

// функция "Отправить жалобу"
const sendComplaint = () => {
  console.log('--- Новая жалоба ---')
  console.log(complaintText.value)
  
  alert('Жалоба успешно отправлена (проверь консоль)!')
  complaintText.value = '' // очискам поля после отправки
}
</script>

<style scoped>
/* времемые стили */
.profile-container {
  max-width: 600px;
  margin: 0 auto;
}
.profile-card, .form-section {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #444;
}
textarea {
  width: 100%;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  box-sizing: border-box;
  resize: vertical;
}
button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}
button:hover {
  background: #2563eb;
}
.btn-danger {
  background: #ef4444;
}
.btn-danger:hover {
  background: #dc2626;
}
</style>