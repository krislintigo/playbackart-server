export const answers = {
  success: {
    user: {
      created: 'Пользователь зарегистрирован!',
      login: 'Вы вошли в аккаунт!',
      logout: 'Вы вышли из аккаунта!',
      getOne: 'Пользователь получен!',
      getAll: 'Пользователи получены!',
      updateWatching: 'Список обновлен!',
    },
    item: {
      created: 'Элемент создан!',
      getAll: 'Все элементы получены!',
      getByType: 'Элементы по категории получены!',
      getOne: 'Элемент получен!',
      updated: 'Элемент обновлен!',
      deleted: 'Элемент удален!',
      loaded: 'Элементы загружены!',
    },
  },
  error: {
    user: {
      notFound: 'Пользователь не найден!',
      alreadyExists: 'Пользователь уже существует!',
      badCredentials: 'Неверный логин или пароль!',
      invalidToken: 'Требуется авторизация!',
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
