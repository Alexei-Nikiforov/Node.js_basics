// Функция для генерации случайного пароля из 12 символов
function generatePassword() {
    // Массив символов для включения в пароль
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    // Цикл для выбора случайных символов и добавления их в пароль
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
};

console.log(`Password: ${generatePassword()}`);