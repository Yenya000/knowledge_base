const { query } = require('./db');

async function checkUser() {
    try {
        const result = await query('SELECT employee_id, password_hash, role FROM users WHERE employee_id = $1', ['OBL-0001']);
        
        if (result.rows.length === 0) {
            console.log('❌ Пользователь OBL-0001 НЕ НАЙДЕН в базе данных');
        } else {
            const user = result.rows[0];
            console.log('✅ Пользователь найден:');
            console.log('   employee_id:', user.employee_id);
            console.log('   role:', user.role);
            console.log('   password_hash:', user.password_hash.substring(0, 30) + '...');
        }
    } catch (err) {
        console.error('Ошибка:', err.message);
    }
}

checkUser();