export const answers = {
  success: {
    user: {
      created: 'Пользователь успешно зарегистрирован!',
      login: 'Вы успешно вошли в аккаунт!',
      logout: 'Вы успешно вышли из аккаунта!',
      getOne: 'Пользователь успешно получен!',
      getAll: 'Пользователи успешно получены!',
    },
    item: {
      created: 'Элемент успешно создан!',
      getAll: 'Все элементы успешно получены!',
      getByType: 'Элементы по категории успешно получены!',
      getOne: 'Элемент успешно получен!',
      updated: 'Элемент успешно обновлен!',
      deleted: 'Элемент успешно удален!',
      loaded: 'Элементы успешно загружены!',
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

export type answerType = {
  statusCode: number;
  message: string | Array<string>;
  error?: string;
  data?: any;
};
