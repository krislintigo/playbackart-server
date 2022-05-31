export const answers = {
  success: {
    user: {
      created: 'Пользователь успешно зарегистрирован!',
      login: 'Вы успешно вошли в аккаунт!',
      logout: 'Вы успешно вышли из аккаунта!',
    },
    item: {
      created: 'Элемент успешно создан!',
      updated: 'Элемент успешно обновлен!',
      deleted: 'Элемент успешно удален!',
    },
  },
  error: {
    user: {
      notFound: 'Пользователь не найден!',
      alreadyExists: 'Пользователь уже существует!',
      badCredentials: 'Неверный логин или пароль!',
      invalidToken: 'Неверный токен!',
    },
    item: {
      notFound: 'Элемент не найден!',
    },
  },
};
