/* Cinemax frontend. The API and the page share the same FastAPI server. */
const icons = {
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  back: '<path d="M19 12H5m5-5-5 5 5 5"/>',
  play: '<path d="m9 5 11 7-11 7z"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
  ticket: '<path d="M3 7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a2 2 0 0 0 0 4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a2 2 0 0 0 0-4z"/><path d="M15 6v3m0 2v2m0 2v3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  moon: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  seat: '<path d="M6 13V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v7M4 11v7h16v-7M6 18v3m12-3v3M4 15h16"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
  sound: '<path d="m11 4-6 5H2v6h3l6 5zM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  logout: '<path d="M9 4H4v16h5m6-13 5 5-5 5m-6-5h11"/>',
  settings: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
};
function icon(name, size = 17) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.film}</svg>`;
}

const words = {
  en: {
    films: 'Now showing', schedule: 'Showtimes', tickets: 'My tickets', studio: 'Studio', account: 'My account', signin: 'Sign in', signup: 'Create account', signout: 'Sign out',
    dark: 'Switch to dark mode', light: 'Switch to light mode', heroBadge: 'The big screen is calling', heroTitle: 'GOOD STORIES.<br>GREAT SEATS.<br><span class="accent">REAL CINEMA.</span>', heroDescription: 'Leave the everyday at the door. Discover your next favorite film and make a night of it.', explore: 'Explore films', findShow: 'Find a showtime', heroNote: 'A little escape. A bigger experience.', artCaption: 'Somewhere beyond the ordinary', artTitle: 'FEEL EVERY FRAME', strip1: 'Made for the big screen', strip2: 'Your seat. Your moment.', strip3: 'A simple way to book', stripTagline: 'THE LIGHTS DIM. THE STORY BEGINS.',
    program: 'THE PROGRAM', nowTitle: 'On the big screen', nowDescription: 'Your next great story starts here.', allFilms: 'All films', allGenres: 'All genres', search: 'Find your next film…', noFilms: 'The next story is on its way', noFilmsText: 'There are no films in the program yet. Check back soon.', noResults: 'No films found', noResultsText: 'Try another title or a different genre.', reset: 'Clear filters', viewTimes: 'View showtimes', minutes: 'min', nextShow: 'Next screening', noUpcoming: 'Showtimes coming soon', posterKicker: 'A BIG SCREEN EXPERIENCE', posterAction: 'Discover the story',
    experienceLabel: 'MORE THAN A MOVIE', experienceTitle: 'Make room for<br>a little movie magic.', experienceText: 'Pick your film. Choose your favorite seat. Let the real world wait for a while.', experienceCta: 'Plan your cinema night', footer: 'For the love of the big screen.', footerNote: 'PICK A SEAT. FEEL EVERY FRAME.',
    scheduleTitle: 'Make it a movie night', scheduleDescription: 'Find the right film at the right time.', allHalls: 'All halls', allMovies: 'All films', today: 'Today', tomorrow: 'Tomorrow', noShows: 'A quiet day at the cinema', noShowsText: 'No upcoming screenings for this date. Choose another day.', chooseSeats: 'Choose your seat', from: 'from', currency: 'TJS', hall: 'Hall', backFilms: 'Back to films', backShows: 'Back to showtimes', screening: 'SCREENING', movieAbout: 'The story', movieSessions: 'Upcoming screenings', date: 'Date', time: 'Time',
    seatsTitle: 'Your spot in the story', seatsDescription: 'Choose one seat for this booking.', screen: 'The screen is here', available: 'Available', selected: 'Selected', booked: 'Booked', unavailable: 'Unavailable', bookingSummary: 'Your cinema night', row: 'Row', seat: 'Seat', chooseSeat: 'Choose a seat on the map', total: 'Total', book: 'Book this seat', loginBook: 'Sign in to book', customerOnly: 'Bookings are available to customer accounts.', bookingNote: 'Your ticket is confirmed immediately. You can cancel before the screening starts.', bookingSuccess: 'Your seat is booked. Enjoy the show!', soldOut: 'This screening is fully booked.', seatEmpty: 'This hall has no seats yet.',
    ticketTitle: 'Good nights, booked.', ticketDescription: 'Your upcoming plans and cinema memories, all in one place.', allTickets: 'All tickets', upcoming: 'Booked', cancelled: 'Cancelled', noTickets: 'Your next night out awaits', noTicketsText: 'Book a film and your tickets will appear here.', ticketNumber: 'TICKET', cancel: 'Cancel ticket', cancelTitle: 'Change of plans?', cancelText: 'Cancel this ticket? Your seat will become available to someone else.', keepTicket: 'Keep my ticket', confirmCancel: 'Yes, cancel ticket', cancelledSuccess: 'Your ticket has been cancelled.', alreadyStarted: 'Screening has started', customerTickets: 'My tickets is available to customer accounts. Your management tools are in the Studio.',
    loginTitle: 'Welcome back.', signupTitle: 'Your next story starts here.', loginIntro: 'Sign in. Settle in. Enjoy the show.', signupIntro: 'A few details, a whole world of cinema.', name: 'Full name', email: 'Email address', password: 'Password', passwordHelp: 'At least 8 characters', loginAction: 'Sign in', signupAction: 'Create my account', welcome: 'You’re signed in. Welcome to the cinema.', registered: 'Your account is ready. Welcome!', loginRequired: 'The best seat is waiting for you', loginRequiredText: 'Sign in to view your tickets and manage your account.', signedOut: 'You have signed out.', close: 'Close', working: 'One moment…',
    accountTitle: 'Your corner of the cinema', profile: 'Your profile', membership: 'YOUR CINEMA ACCOUNT', save: 'Save changes', profileSaved: 'Your profile has been updated.', role: 'Role', joined: 'Member since', customer: 'Customer', manager: 'Cinema manager', admin: 'Administrator',
    studioTitle: 'Behind the scenes', studioDescription: 'Bring the next cinema night to life.', addMovie: 'Add a film', addHall: 'Create a hall', addSeat: 'Add a seat', addShowtime: 'Schedule a screening', title: 'Film title', description: 'Description', duration: 'Duration in minutes', genre: 'Genre', ageRating: 'Age rating', hallName: 'Hall name', capacity: 'Capacity', movie: 'Film', startsAt: 'Screening starts', price: 'Ticket price', selectOption: 'Choose…', created: 'Created successfully.', studioOnly: 'This area is for cinema managers and administrators.', dateHelp: 'Use your local time. It will be converted to UTC.', users: 'User roles', changeRole: 'Save role', roleSaved: 'Role updated.', noUsers: 'No users found.',
    previous: 'Previous', next: 'Next', page: 'Page', of: 'of', loading: 'Setting the scene…', retry: 'Try again', errorTitle: 'A small intermission', errorText: 'We couldn’t load this page. Please try again.', networkError: 'Cannot reach the cinema. Check your connection and try again.', invalid: 'Please check the form fields.', expired: 'Your session has expired. Please sign in again.', forbidden: 'Your account does not have access to this action.', notFound: 'This item could not be found.', conflict: 'Something changed. Please refresh and try again.', serverError: 'Something went wrong. Please try again.', selectSeatFirst: 'Choose an available seat first.', notAvailable: 'This screening is no longer available for booking.', notFoundTitle: 'This scene is missing', notFoundText: 'That page does not exist. Let’s get you back to the films.',
  },
  ru: {
    films: 'В кино', schedule: 'Расписание', tickets: 'Мои билеты', studio: 'Управление', account: 'Мой профиль', signin: 'Войти', signup: 'Регистрация', signout: 'Выйти',
    dark: 'Включить тёмную тему', light: 'Включить светлую тему', heroBadge: 'Большой экран зовёт', heroTitle: 'БОЛЬШИЕ ИСТОРИИ.<br>ЛУЧШИЕ МЕСТА.<br><span class="accent">НАСТОЯЩЕЕ КИНО.</span>', heroDescription: 'Оставьте повседневность за дверью. Найдите новый любимый фильм и проведите вечер в кино.', explore: 'Выбрать фильм', findShow: 'Найти сеанс', heroNote: 'Немного отдыха. Намного больше впечатлений.', artCaption: 'За пределами повседневности', artTitle: 'ПРОЧУВСТВУЙ КАЖДЫЙ КАДР', strip1: 'Для большого экрана', strip2: 'Ваше место. Ваш момент.', strip3: 'Бронировать просто', stripTagline: 'СВЕТ ГАСНЕТ. ИСТОРИЯ НАЧИНАЕТСЯ.',
    program: 'АФИША', nowTitle: 'На большом экране', nowDescription: 'Ваша следующая история начинается здесь.', allFilms: 'Все фильмы', allGenres: 'Все жанры', search: 'Какой фильм ищем?', noFilms: 'Скоро новая история', noFilmsText: 'В афише пока нет фильмов. Загляните чуть позже.', noResults: 'Фильмы не найдены', noResultsText: 'Попробуйте другое название или жанр.', reset: 'Сбросить фильтры', viewTimes: 'Посмотреть сеансы', minutes: 'мин', nextShow: 'Ближайший сеанс', noUpcoming: 'Сеансы скоро появятся', posterKicker: 'ИСТОРИЯ ДЛЯ БОЛЬШОГО ЭКРАНА', posterAction: 'Откройте новую историю',
    experienceLabel: 'БОЛЬШЕ, ЧЕМ ФИЛЬМ', experienceTitle: 'Впустите в вечер<br>немного магии кино.', experienceText: 'Найдите фильм. Выберите любимое место. Пусть остальной мир немного подождёт.', experienceCta: 'Спланировать вечер', footer: 'С любовью к большому экрану.', footerNote: 'ВЫБЕРИ МЕСТО. ПРОЧУВСТВУЙ КАЖДЫЙ КАДР.',
    scheduleTitle: 'Сегодня идём в кино', scheduleDescription: 'Найдите свой фильм и удобное время.', allHalls: 'Все залы', allMovies: 'Все фильмы', today: 'Сегодня', tomorrow: 'Завтра', noShows: 'Тихий день в кино', noShowsText: 'На эту дату пока нет будущих сеансов. Выберите другой день.', chooseSeats: 'Выбрать место', from: 'от', currency: 'сом.', hall: 'Зал', backFilms: 'Назад к фильмам', backShows: 'Назад к расписанию', screening: 'СЕАНС', movieAbout: 'О фильме', movieSessions: 'Ближайшие сеансы', date: 'Дата', time: 'Время',
    seatsTitle: 'Ваше место в истории', seatsDescription: 'Выберите одно место для бронирования.', screen: 'Здесь находится экран', available: 'Свободно', selected: 'Выбрано', booked: 'Занято', unavailable: 'Недоступно', bookingSummary: 'Ваш вечер в кино', row: 'Ряд', seat: 'Место', chooseSeat: 'Выберите место на схеме', total: 'Итого', book: 'Забронировать', loginBook: 'Войти и забронировать', customerOnly: 'Бронирование доступно для аккаунтов зрителей.', bookingNote: 'Билет подтверждается сразу. Его можно отменить до начала сеанса.', bookingSuccess: 'Ваше место забронировано. Приятного просмотра!', soldOut: 'На этот сеанс все места заняты.', seatEmpty: 'В этом зале пока нет мест.',
    ticketTitle: 'Хороший вечер забронирован.', ticketDescription: 'Ваши планы и воспоминания о кино — в одном месте.', allTickets: 'Все билеты', upcoming: 'Забронированные', cancelled: 'Отменённые', noTickets: 'Ваш следующий вечер ещё впереди', noTicketsText: 'Выберите фильм, и ваши билеты появятся здесь.', ticketNumber: 'БИЛЕТ', cancel: 'Отменить билет', cancelTitle: 'Планы изменились?', cancelText: 'Отменить этот билет? Место станет доступно другим зрителям.', keepTicket: 'Оставить билет', confirmCancel: 'Да, отменить билет', cancelledSuccess: 'Ваш билет отменён.', alreadyStarted: 'Сеанс уже начался', customerTickets: 'Мои билеты доступны аккаунтам зрителей. Инструменты управления находятся в разделе «Управление».',
    loginTitle: 'С возвращением.', signupTitle: 'Ваша история начинается здесь.', loginIntro: 'Войдите. Устраивайтесь. Приятного просмотра.', signupIntro: 'Немного о вас — и целый мир кино.', name: 'Полное имя', email: 'Электронная почта', password: 'Пароль', passwordHelp: 'Не менее 8 символов', loginAction: 'Войти', signupAction: 'Создать аккаунт', welcome: 'Вы вошли. Добро пожаловать в кино.', registered: 'Аккаунт создан. Добро пожаловать!', loginRequired: 'Лучшее место ждёт вас', loginRequiredText: 'Войдите, чтобы смотреть билеты и управлять профилем.', signedOut: 'Вы вышли из аккаунта.', close: 'Закрыть', working: 'Одну минуту…',
    accountTitle: 'Ваш уголок в мире кино', profile: 'Ваш профиль', membership: 'ВАШ АККАУНТ', save: 'Сохранить изменения', profileSaved: 'Профиль обновлён.', role: 'Роль', joined: 'С нами с', customer: 'Зритель', manager: 'Менеджер кинотеатра', admin: 'Администратор',
    studioTitle: 'По ту сторону экрана', studioDescription: 'Создайте следующий незабываемый вечер.', addMovie: 'Добавить фильм', addHall: 'Создать зал', addSeat: 'Добавить место', addShowtime: 'Запланировать сеанс', title: 'Название фильма', description: 'Описание', duration: 'Длительность в минутах', genre: 'Жанр', ageRating: 'Возрастной рейтинг', hallName: 'Название зала', capacity: 'Вместимость', movie: 'Фильм', startsAt: 'Начало сеанса', price: 'Цена билета', selectOption: 'Выберите…', created: 'Успешно создано.', studioOnly: 'Этот раздел доступен менеджерам и администраторам.', dateHelp: 'Укажите местное время. Оно будет преобразовано в UTC.', users: 'Роли пользователей', changeRole: 'Сохранить роль', roleSaved: 'Роль обновлена.', noUsers: 'Пользователи не найдены.',
    previous: 'Назад', next: 'Далее', page: 'Страница', of: 'из', loading: 'Готовим сцену…', retry: 'Попробовать снова', errorTitle: 'Небольшой антракт', errorText: 'Не удалось загрузить страницу. Попробуйте ещё раз.', networkError: 'Нет связи с кинотеатром. Проверьте соединение и повторите попытку.', invalid: 'Проверьте заполнение полей.', expired: 'Сессия истекла. Пожалуйста, войдите снова.', forbidden: 'У вашего аккаунта нет доступа к этому действию.', notFound: 'Запись не найдена.', conflict: 'Данные изменились. Обновите страницу и попробуйте снова.', serverError: 'Что-то пошло не так. Попробуйте ещё раз.', selectSeatFirst: 'Сначала выберите свободное место.', notAvailable: 'Этот сеанс больше недоступен для бронирования.', notFoundTitle: 'Эта сцена потерялась', notFoundText: 'Такой страницы нет. Давайте вернёмся к фильмам.',
  },
};

function readSetting(key, fallback, session = false) {
  try { return (session ? sessionStorage : localStorage).getItem(key) || fallback; } catch (_) { return fallback; }
}
function writeSetting(key, value, session = false) {
  try { const storage = session ? sessionStorage : localStorage; value ? storage.setItem(key, value) : storage.removeItem(key); } catch (_) {}
}
const state = {
  lang: readSetting('cinema-language', 'en') === 'ru' ? 'ru' : 'en',
  token: readSetting('cinema-token', '', true), user: null,
  movies: [], halls: [], shows: [], movieDetails: new Map(), catalogLoaded: false, catalogPromise: null,
  genre: '', search: '', day: '', scheduleHall: '', scheduleMovie: '',
  ticketStatus: '', ticketPage: 1, selectedSeat: null, seatShow: null,
  currentMap: null, currentShow: null, revision: 0, busy: false,
};
const main = document.querySelector('#main');
const t = key => words[state.lang][key] || words.en[key] || key;
const locale = () => state.lang === 'ru' ? 'ru-RU' : 'en-GB';
const manager = () => ['Admin', 'CinemaManager'].includes(state.user?.role);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const money = value => `${Number(value).toLocaleString(locale(), {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${t('currency')}`;
const time = value => new Date(value).toLocaleTimeString(locale(), {hour:'2-digit', minute:'2-digit'});
const date = value => new Date(value).toLocaleDateString(locale(), {day:'numeric', month:'short', year:'numeric'});
const dayKey = value => { const d = new Date(value); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const roleLabel = role => t(role === 'Admin' ? 'admin' : role === 'CinemaManager' ? 'manager' : 'customer');
const movieById = id => state.movies.find(movie => movie.id === Number(id)) || state.movieDetails.get(Number(id));
const hallById = id => state.halls.find(hall => hall.id === Number(id));
const canBookShow = show => show.status === 'scheduled'
  && new Date(show.starts_at) > new Date()
  && Boolean(movieById(show.movie_id)?.is_active)
  && Boolean(hallById(show.hall_id)?.is_active);
const poster = movie => {
  const genre = (movie?.genre || '').toLowerCase();
  if (/sci|space|фантаст|космо/.test(genre)) return '/static/assets/poster-orbit.svg';
  if (/advent|fantasy|приключ|фэнтез/.test(genre)) return '/static/assets/poster-dunes.svg';
  return `/static/assets/poster-${['orbit','noir','dunes'][(movie?.id || 1) % 3]}.svg`;
};

function brand() {
  return '<a class="brand" href="#/films" data-route="/films" aria-label="Cinemax"><img src="/static/assets/mark.svg" alt=""><span>Cine<em>max</em></span></a>';
}
function renderChrome() {
  document.documentElement.lang = state.lang;
  const route = location.hash.slice(1) || '/films';
  const theme = document.documentElement.dataset.theme;
  const links = [['/films','films','film'],['/showtimes','schedule','calendar'],['/tickets','tickets','ticket']];
  if (manager()) links.push(['/studio','studio','settings']);
  document.querySelector('#header').innerHTML = `<div class="container header-inner">${brand()}<nav class="header-nav" aria-label="${state.lang === 'ru' ? 'Главное меню' : 'Main navigation'}">${links.map(([path,key,symbol]) => `<a class="nav-link ${route.startsWith(path) || (path === '/films' && route.startsWith('/movie/')) || (path === '/showtimes' && route.startsWith('/seats/')) ? 'active' : ''}" href="#${path}" data-route="${path}" ${route === path ? 'aria-current="page"' : ''}>${icon(symbol,15)}${t(key)}</a>`).join('')}</nav><div class="header-actions"><div class="language-switch" role="group" aria-label="Language / Язык"><button data-lang="en" class="${state.lang==='en'?'active':''}" aria-pressed="${state.lang==='en'}">EN</button><button data-lang="ru" class="${state.lang==='ru'?'active':''}" aria-pressed="${state.lang==='ru'}">RU</button></div><button class="icon-button" data-action="theme" aria-label="${t(theme==='dark'?'light':'dark')}" title="${t(theme==='dark'?'light':'dark')}">${icon(theme==='dark'?'sun':'moon',16)}</button>${state.user ? `<a class="button small secondary header-signin" href="#/account" data-route="/account" aria-label="${t('account')}">${icon('user',14)}<span>${esc(state.user.full_name.split(' ')[0])}</span></a>` : `<button class="button small header-signin" data-action="login">${icon('user',14)}${t('signin')}</button>`}</div></div>`;
  document.querySelector('#footer').innerHTML = `<div class="container footer-inner">${brand()}<span>${t('footer')}</span><span class="footer-note">${t('footerNote')}</span><span>© ${new Date().getFullYear()} Cinemax</span></div>`;
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.classList.contains('active')) link.style.color = 'var(--red)';
  });
}

const apiErrors = {
  'Incorrect email or password': ['Incorrect email or password.', 'Неверная почта или пароль.'],
  'Email already registered': ['This email is already registered.', 'Эта почта уже зарегистрирована.'],
  'Seat already booked': ['This seat was just booked. Please choose another.', 'Это место уже забронировали. Выберите другое.'],
  'User account is inactive': ['This account is inactive.', 'Этот аккаунт отключён.'],
  'Another showtime overlaps in this hall': ['Another screening overlaps in this hall.', 'В этом зале уже есть пересекающийся сеанс.'],
  'Hall capacity reached': ['This hall has reached its capacity.', 'Вместимость зала исчерпана.'],
  'Seat conflicts with existing data': ['That row and seat already exist.', 'Такое место в этом ряду уже существует.'],
  'Hall name already exists': ['A hall with this name already exists.', 'Зал с таким названием уже существует.'],
  'Showtime has already started': ['The screening has already started.', 'Сеанс уже начался.'],
  'Showtime must start in the future': ['Choose a start time in the future.', 'Выберите время начала в будущем.'],
  'Showtime is not available for booking': ['This screening is no longer available.', 'Этот сеанс больше недоступен.'],
};
async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (state.token) headers.set('Authorization', `Bearer ${state.token}`);
  let body = options.body;
  if (body && !(body instanceof URLSearchParams) && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }
  let response;
  try { response = await fetch('/api/v1' + path, {...options, headers, body}); }
  catch (_) { throw new Error(t('networkError')); }
  const result = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const detail = result?.detail;
    let message;
    if (typeof detail === 'string' && apiErrors[detail]) message = apiErrors[detail][state.lang === 'ru' ? 1 : 0];
    else if (response.status === 422) message = t('invalid');
    else if (response.status === 401) message = path === '/auth/login' ? apiErrors['Incorrect email or password'][state.lang==='ru'?1:0] : t('expired');
    else if (state.lang === 'en' && typeof detail === 'string') message = detail;
    else message = t(({403:'forbidden',404:'notFound',409:'conflict'})[response.status] || 'serverError');
    if (response.status === 401 && path !== '/auth/login') {
      state.token = ''; state.user = null; writeSetting('cinema-token','',true); renderChrome();
    }
    const error = new Error(message); error.status = response.status; throw error;
  }
  return result;
}
async function allPages(path) {
  const separator = path.includes('?') ? '&' : '?';
  const first = await api(`${path}${separator}page_size=100&page=1`);
  const items = [...first.items];
  for (let page = 2; page <= first.total_pages; page++) {
    const result = await api(`${path}${separator}page_size=100&page=${page}`);
    items.push(...result.items);
  }
  return items;
}
async function loadCatalog(force = false) {
  if (state.catalogPromise) return state.catalogPromise;
  if (state.catalogLoaded && !force) return;
  state.catalogPromise = Promise.all([allPages('/movies?is_active=true&sort=title'), api('/halls')]).then(([movies,halls]) => {
    state.movies = movies; state.halls = halls; state.catalogLoaded = true;
  }).finally(() => { state.catalogPromise = null; });
  return state.catalogPromise;
}
async function loadShows() {
  state.shows = await allPages(`/showtimes?status=scheduled&date_from=${encodeURIComponent(new Date().toISOString())}`);
  return state.shows;
}
function toast(message, success = false) {
  const node = document.createElement('div'); node.className = `toast ${success?'success':''}`;
  node.textContent = message; document.querySelector('#toasts').append(node);
  setTimeout(() => node.remove(), 5500);
}
function empty(title, text, button = '', symbol = 'film') {
  return `<div class="empty-state"><div class="empty-icon">${icon(symbol,26)}</div><h2>${esc(title)}</h2><p>${esc(text)}</p>${button}</div>`;
}
function pageHead(title, description = '', back = '') {
  return `<div class="page-head container">${back}<p class="eyebrow">CINEMAX</p><h1 class="page-title">${esc(title)}</h1>${description?`<p>${esc(description)}</p>`:''}</div>`;
}
function routeButton(route, label, extra = '') {
  return `<a class="button ${extra}" href="#${route}" data-route="${route}">${esc(label)}${icon('arrow',15)}</a>`;
}
function backLink(route, label) {
  return `<a class="breadcrumb" href="#${route}" data-route="${route}">${icon('back',14)}${esc(label)}</a>`;
}
function posterMarkup(movie) {
  return `<button class="movie-poster" data-route="/movie/${movie.id}" aria-label="${esc(t('viewTimes') + ': ' + movie.title)}"><img src="${poster(movie)}" alt="" loading="lazy"><span class="poster-rating">${esc(movie.age_rating)}</span><span class="poster-genre">${esc(movie.genre)}</span><span class="poster-title"><span class="poster-kicker">${t('posterKicker')}</span>${esc(movie.title)}</span><span class="poster-action">${t('posterAction')}${icon('arrow',12)}</span></button>`;
}
function movieCard(movie) {
  const next = state.shows.find(show => show.movie_id === movie.id);
  return `<article class="movie-card">${posterMarkup(movie)}<div class="movie-info"><h3 class="movie-title">${esc(movie.title)}</h3><div class="movie-meta"><span>${esc(movie.genre)}</span><span>·</span><span>${esc(movie.age_rating)}</span><span class="movie-time">${icon('clock',11)} ${movie.duration_minutes} ${t('minutes')}</span></div><div class="next-show" style="margin-top:9px;color:var(--muted);font-size:10px">${next ? `${t('nextShow')} <strong style="float:right">${date(next.starts_at)} · ${time(next.starts_at)}</strong>` : t('noUpcoming')}</div></div></article>`;
}
function filmGrid() {
  const query = state.search.trim().toLocaleLowerCase(locale());
  const filtered = state.movies.filter(movie => (!state.genre || movie.genre === state.genre) && (!query || movie.title.toLocaleLowerCase(locale()).includes(query)));
  return filtered.length ? filtered.map(movieCard).join('') : empty(t(state.movies.length?'noResults':'noFilms'),t(state.movies.length?'noResultsText':'noFilmsText'), state.movies.length ? `<button class="button secondary" data-action="reset-films">${t('reset')}</button>` : manager() ? routeButton('/studio',t('addMovie')) : '');
}
async function filmsPage() {
  await Promise.all([loadCatalog(), loadShows()]);
  const genres = [...new Set(state.movies.map(movie => movie.genre))];
  return `<section class="hero"><img class="hero-art" src="/static/assets/hero.svg" alt=""><div class="container"><div class="hero-inner"><span class="badge">${t('heroBadge')}</span><h1>${t('heroTitle')}</h1><p class="hero-description">${t('heroDescription')}</p><div class="hero-buttons"><a class="button large" href="#program" data-action="explore">${icon('ticket',16)}${t('explore')}</a>${routeButton('/showtimes',t('findShow'),'secondary large')}</div><div class="hero-footnote">${icon('film',14)}${t('heroNote')}</div></div></div><div class="hero-caption">${t('artCaption')}<strong>${t('artTitle')}</strong></div></section><div class="editorial-strip"><div class="container strip-inner"><span>${icon('film',16)}${t('strip1')}</span><span>${icon('seat',16)}${t('strip2')}</span><span class="strip-tagline">${t('stripTagline')}</span><span>${icon('ticket',16)}${t('strip3')}</span></div></div><section class="section container" id="program"><div class="section-heading"><div><p class="eyebrow">${t('program')}</p><h2>${t('nowTitle')}<span class="heading-count">${String(state.movies.length).padStart(2,'0')}</span></h2><p>${t('nowDescription')}</p></div><a class="text-button" href="#/showtimes" data-route="/showtimes">${t('schedule')} ${icon('arrow',14)}</a></div><div class="filter-bar"><button class="filter-chip ${!state.genre?'active':''}" data-genre="">${t('allFilms')}</button>${genres.slice(0,5).map(genre=>`<button class="filter-chip ${state.genre===genre?'active':''}" data-genre="${esc(genre)}">${esc(genre)}</button>`).join('')}<label class="search-box">${icon('search',15)}<span class="sr-only">${t('search')}</span><input type="search" id="film-search" placeholder="${t('search')}" value="${esc(state.search)}" autocomplete="off"></label></div><div class="movie-grid" id="film-grid">${filmGrid()}</div></section><section class="container experience"><div class="experience-visual" aria-hidden="true"><div class="experience-screen">CINEMA</div><div class="seat-lines"></div></div><div class="experience-copy"><p class="eyebrow">${t('experienceLabel')}</p><h2>${t('experienceTitle')}</h2><p>${t('experienceText')}</p><a class="text-button" href="#/showtimes" data-route="/showtimes" style="color:var(--red)">${t('experienceCta')} ${icon('arrow',15)}</a></div></section>`;
}

function showSlot(show) {
  return `<a class="time-slot" href="#/seats/${show.id}" data-route="/seats/${show.id}" aria-label="${esc(t('chooseSeats') + ', ' + date(show.starts_at) + ', ' + time(show.starts_at))}"><strong>${time(show.starts_at)}</strong><span>${money(show.ticket_price)}</span></a>`;
}
function dateButtons() {
  const keys = new Set();
  for (let i=0;i<7;i++) { const d=new Date();d.setDate(d.getDate()+i);keys.add(dayKey(d)); }
  state.shows.forEach(show=>keys.add(dayKey(show.starts_at)));
  const days = [...keys].sort();
  const today = dayKey(new Date()); const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
  return days.map(key => {
    const d = new Date(key + 'T12:00:00');
    const label = key === today ? t('today') : key === dayKey(tomorrow) ? t('tomorrow') : d.toLocaleDateString(locale(),{weekday:'short'});
    return `<button class="date-button ${state.day===key?'active':''}" data-day="${key}" aria-pressed="${state.day===key}"><span>${esc(label)}</span><strong>${d.getDate()}</strong><span>${d.toLocaleDateString(locale(),{month:'short'})}</span></button>`;
  }).join('');
}
function scheduleResults() {
  const shows = state.shows.filter(show=>dayKey(show.starts_at)===state.day && (!state.scheduleHall || show.hall_id===Number(state.scheduleHall)) && (!state.scheduleMovie || show.movie_id===Number(state.scheduleMovie)));
  const groups = new Map();
  shows.forEach(show=>{const key=`${show.movie_id}-${show.hall_id}`;if(!groups.has(key)) groups.set(key,[]);groups.get(key).push(show);});
  return groups.size ? `<div class="schedule-list">${[...groups.values()].map(group=>{
    const first=group[0], movie=movieById(first.movie_id), hall=hallById(first.hall_id);
    return `<article class="schedule-item"><img class="schedule-thumb" src="${poster(movie)}" alt=""><div><h3><a href="#/movie/${first.movie_id}" data-route="/movie/${first.movie_id}">${esc(movie?.title || t('movie')+' #'+first.movie_id)}</a></h3><p>${esc(movie?.genre || '')} ${movie?`· ${movie.duration_minutes} ${t('minutes')} · ${esc(movie.age_rating)}`:''}</p><p style="margin-top:4px">${esc(hall?.name || t('hall')+' #'+first.hall_id)}</p></div><div class="schedule-slots">${group.map(showSlot).join('')}</div></article>`;
  }).join('')}</div>` : empty(t('noShows'),t('noShowsText'), manager()?routeButton('/studio',t('addShowtime')):'','calendar');
}
async function schedulePage() {
  await Promise.all([loadCatalog(),loadShows()]);
  if (!state.day) state.day = state.shows.length ? dayKey(state.shows[0].starts_at) : dayKey(new Date());
  return `${pageHead(t('scheduleTitle'),t('scheduleDescription'))}<section class="container page-content"><div class="page-toolbar"><label><span class="sr-only">${t('hall')}</span><select id="schedule-hall"><option value="">${t('allHalls')}</option>${state.halls.filter(h=>h.is_active).map(h=>`<option value="${h.id}" ${state.scheduleHall===String(h.id)?'selected':''}>${esc(h.name)}</option>`).join('')}</select></label><label><span class="sr-only">${t('movie')}</span><select id="schedule-movie"><option value="">${t('allMovies')}</option>${state.movies.map(m=>`<option value="${m.id}" ${state.scheduleMovie===String(m.id)?'selected':''}>${esc(m.title)}</option>`).join('')}</select></label></div><div class="date-strip" id="date-strip">${dateButtons()}</div><div id="schedule-results">${scheduleResults()}</div></section>`;
}
async function moviePage(id) {
  await Promise.all([loadCatalog(),loadShows()]);
  const movie = movieById(id) || await api(`/movies/${id}`);
  const shows = state.shows.filter(show=>show.movie_id===movie.id);
  return `<section class="container page-content"><div class="page-head">${backLink('/films',t('backFilms'))}</div><div class="movie-detail">${posterMarkup(movie)}<div class="detail-copy"><p class="eyebrow">${t('screening')}</p><h1>${esc(movie.title)}</h1><div class="movie-meta"><span>${esc(movie.genre)}</span><span>·</span><span>${movie.duration_minutes} ${t('minutes')}</span><span>·</span><span>${esc(movie.age_rating)}</span></div><p class="detail-description">${esc(movie.description)}</p><div class="section-heading"><h2>${t('movieSessions')}</h2></div>${shows.length?`<div class="schedule-list">${shows.map(show=>`<div class="schedule-item" style="grid-template-columns:1fr auto"><div><strong>${date(show.starts_at)}</strong><p>${esc(hallById(show.hall_id)?.name || t('hall')+' #'+show.hall_id)}</p></div>${showSlot(show)}</div>`).join('')}</div>`:empty(t('noUpcoming'),t('noShowsText'),routeButton('/showtimes',t('schedule')),'calendar')}</div></div></section>`;
}

function bookingSummary() {
  const show = state.currentShow, map=state.currentMap;
  if (!show || !map) return '';
  const movie=movieById(show.movie_id), seat=state.selectedSeat;
  const canBook=canBookShow(show);
  return `<p class="eyebrow">${t('bookingSummary')}</p><h2 style="font:600 31px/1.1 var(--display);text-transform:uppercase;margin-bottom:22px">${esc(movie?.title || t('movie')+' #'+show.movie_id)}</h2><div class="summary-details"><p>${icon('calendar',15)} ${date(show.starts_at)}</p><p>${icon('clock',15)} ${time(show.starts_at)}</p><p>${icon('film',15)} ${esc(map.hall_name)}</p></div><div style="border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:19px 0;margin:20px 0;font-size:12px">${seat?`${icon('seat',15)} ${t('row')} <strong>${seat.row_number}</strong> · ${t('seat')} <strong>${seat.seat_number}</strong>`:`<span style="color:var(--muted)">${t('chooseSeat')}</span>`}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px"><span style="color:var(--muted);font-size:12px">${t('total')}</span><strong style="font-size:24px">${money(seat?show.ticket_price:0)}</strong></div>${state.user && state.user.role!=='Customer'?`<p class="form-help">${t('customerOnly')}</p>`:`<button class="button" style="width:100%" data-action="book" ${!seat||!canBook||state.busy?'disabled':''}>${icon('ticket',16)}${state.busy?t('working'):t(state.user?'book':'loginBook')}</button>`}<p class="form-help" style="margin-top:15px;line-height:1.8">${canBook?t('bookingNote'):t('notAvailable')}</p>`;
}
async function seatsPage(id, revision = state.revision) {
  await loadCatalog();
  const [show,map] = await Promise.all([api(`/showtimes/${id}`),api(`/showtimes/${id}/seats`)]);
  if (!movieById(show.movie_id)) {
    state.movieDetails.set(show.movie_id, await api(`/movies/${show.movie_id}`));
  }
  if (revision !== state.revision) return '';
  state.currentShow=show;state.currentMap=map;
  if (state.seatShow!==Number(id)) state.selectedSeat=null;
  state.seatShow=Number(id);
  if (state.selectedSeat && !map.rows.some(row=>row.seats.some(seat=>seat.id===state.selectedSeat.id && seat.status==='available'))) state.selectedSeat=null;
  const canBook=canBookShow(show);
  return `${pageHead(t('seatsTitle'),t('seatsDescription'),backLink('/showtimes',t('backShows')))}<section class="container page-content"><div class="booking-layout"><div class="auditorium"><div class="screen">${t('screen')}</div>${map.rows.length?`<div class="seat-scroll"><div class="seat-rows">${map.rows.map(row=>`<div class="seat-row"><span class="row-label">${row.row_number}</span>${row.seats.map(seat=>`<button class="seat ${seat.status} ${state.selectedSeat?.id===seat.id?'selected':''}" data-seat="${seat.id}" aria-label="${t('row')} ${row.row_number}, ${t('seat')} ${seat.seat_number}, ${t(seat.status)}" aria-pressed="${state.selectedSeat?.id===seat.id}" ${seat.status!=='available'||!canBook?'disabled':''}>${seat.status==='unavailable'?'×':seat.seat_number}</button>`).join('')}<span class="row-label">${row.row_number}</span></div>`).join('')}</div></div>`:empty(t('seatEmpty'),'','','seat')}<div class="seat-legend">${['available','selected','booked','unavailable'].map(status=>`<span><i class="legend-square" style="${status==='selected'?'background:var(--red);border-color:var(--red)':status==='booked'?'opacity:.35':status==='unavailable'?'border-style:dashed;opacity:.35':''}"></i>${t(status)}</span>`).join('')}</div>${!map.summary.available && map.summary.total?`<p class="form-help" style="text-align:center;margin:20px 0 0">${t('soldOut')}</p>`:''}</div><aside class="panel booking-summary" id="booking-summary">${bookingSummary()}</aside></div></section>`;
}

function loginGate(title) {
  return `${pageHead(title)}<section class="container page-content">${empty(t('loginRequired'),t('loginRequiredText'),`<button class="button" data-action="login">${t('signin')}${icon('arrow',15)}</button>`,'ticket')}</section>`;
}
async function ticketsPage() {
  if (!state.user) return loginGate(t('tickets'));
  if (state.user.role!=='Customer') return `${pageHead(t('tickets'))}<section class="container page-content">${empty(t('tickets'),t('customerTickets'),manager()?routeButton('/studio',t('studio')):'','ticket')}</section>`;
  await loadCatalog();
  const query=new URLSearchParams({page:String(state.ticketPage),page_size:'8'});
  if(state.ticketStatus) query.set('status',state.ticketStatus);
  const result=await api('/tickets/my?'+query);
  const showIds=[...new Set(result.items.map(ticket=>ticket.showtime_id))];
  const shows=await Promise.all(showIds.map(id=>api(`/showtimes/${id}`)));
  const missingMovies=[...new Set(shows.filter(show=>!movieById(show.movie_id)).map(show=>show.movie_id))];
  await Promise.all(missingMovies.map(async id=>{state.movieDetails.set(id,await api(`/movies/${id}`));}));
  const hallIds=[...new Set(shows.map(show=>show.hall_id))];
  const hallSeats=await Promise.all(hallIds.map(async id=>[id,await api(`/halls/${id}/seats`)]));
  const seats=new Map(hallSeats.flatMap(([,items])=>items.map(seat=>[seat.id,seat])));
  const cards=result.items.map(ticket=>{
    const show=shows.find(show=>show.id===ticket.showtime_id), movie=movieById(show.movie_id), seat=seats.get(ticket.seat_id);
    const canCancel=ticket.status==='booked' && new Date(show.starts_at)>new Date();
    return `<article class="ticket"><img src="${poster(movie)}" alt="" style="height:100%;width:100%;object-fit:cover"><div class="ticket-body"><div class="ticket-top" style="display:flex;justify-content:space-between;margin-bottom:12px"><span class="ticket-id">${t('ticketNumber')} #${String(ticket.id).padStart(5,'0')}</span><span class="badge" style="font-size:8px;letter-spacing:1px;color:${ticket.status==='cancelled'?'var(--muted)':'var(--red)'}">${t(ticket.status==='booked'?'upcoming':'cancelled')}</span></div><h3>${esc(movie?.title || t('movie')+' #'+show.movie_id)}</h3><div class="ticket-details"><span>${date(show.starts_at)} · ${time(show.starts_at)}</span><span>${esc(hallById(show.hall_id)?.name || t('hall')+' #'+show.hall_id)}</span><span>${t('row')} ${seat?.row_number ?? '—'} · ${t('seat')} ${seat?.seat_number ?? ticket.seat_id}</span></div><div class="ticket-bottom"><span class="ticket-price">${money(ticket.price)}</span><span class="barcode" aria-hidden="true"></span>${canCancel?`<button class="text-button" data-cancel-ticket="${ticket.id}">${t('cancel')}</button>`:''}</div></div></article>`;
  }).join('');
  return `${pageHead(t('ticketTitle'),t('ticketDescription'))}<section class="container page-content"><div class="filter-bar">${[['','allTickets'],['booked','upcoming'],['cancelled','cancelled']].map(([value,key])=>`<button class="filter-chip ${state.ticketStatus===value?'active':''}" data-ticket-status="${value}">${t(key)}</button>`).join('')}</div>${result.items.length?`<div class="ticket-list">${cards}</div>`:empty(t('noTickets'),t('noTicketsText'),routeButton('/films',t('explore')),'ticket')}${result.total_pages>1?`<div class="pagination"><button class="button small secondary" data-ticket-page="${state.ticketPage-1}" ${state.ticketPage===1?'disabled':''}>${t('previous')}</button><span>${t('page')} ${state.ticketPage} ${t('of')} ${result.total_pages}</span><button class="button small secondary" data-ticket-page="${state.ticketPage+1}" ${state.ticketPage>=result.total_pages?'disabled':''}>${t('next')}</button></div>`:''}</section>`;
}

function field(name,label,type='text',extra='') {
  return `<div class="field"><label for="${name}">${t(label)}</label><input class="input" id="${name}" name="${name}" type="${type}" ${extra}></div>`;
}
async function accountPage() {
  if(!state.user) return loginGate(t('account'));
  const user=state.user;
  return `${pageHead(t('accountTitle'))}<section class="container page-content"><div class="account-grid"><div class="panel"><div class="account-avatar">${esc(user.full_name[0]?.toUpperCase())}</div><p class="eyebrow">${t('membership')}</p><div class="account-info"><strong>${esc(user.full_name)}</strong>${esc(user.email)}</div><div class="account-info">${t('role')}<strong>${roleLabel(user.role)}</strong></div><div class="account-info">${t('joined')}<strong>${date(user.created_at)}</strong></div><button class="button secondary" data-action="logout">${icon('logout',15)}${t('signout')}</button></div><form class="panel" id="profile-form"><h2>${t('profile')}</h2>${field('full_name','name','text',`required maxlength="100" value="${esc(user.full_name)}" autocomplete="name"`)}${field('email','email','email',`required value="${esc(user.email)}" autocomplete="email"`)}<button class="button" type="submit">${t('save')}${icon('check',16)}</button></form></div></section>`;
}

let fieldCounter = 0;
function selectField(name,label,items,display) {
  const id = `${name}-${++fieldCounter}`;
  return `<div class="field"><label for="${id}">${t(label)}</label><select id="${id}" name="${name}" required><option value="">${t('selectOption')}</option>${items.map(item=>`<option value="${item.id}">${esc(item[display])}</option>`).join('')}</select></div>`;
}
async function studioPage() {
  if(!state.user) return loginGate(t('studio'));
  if(!manager()) return `${pageHead(t('studio'))}<section class="container page-content">${empty(t('studio'),t('studioOnly'),routeButton('/films',t('explore')))}</section>`;
  await loadCatalog(true);
  const users=state.user.role==='Admin'?await allPages('/users'):[];
  const halls=state.halls.filter(hall=>hall.is_active);
  return `${pageHead(t('studioTitle'),t('studioDescription'))}<section class="container page-content"><div class="studio-grid"><form class="panel studio-form" data-resource="movies"><h2>${t('addMovie')}</h2>${field('title','title','text','required maxlength="200"')}<div class="field"><label for="description">${t('description')}</label><textarea id="description" name="description" required></textarea></div><div class="form-grid">${field('duration_minutes','duration','number','required min="1" max="1440"')}${field('genre','genre','text','required maxlength="500"')}${field('age_rating','ageRating','text','required maxlength="10" placeholder="12+"')}</div><button type="submit" class="button">${t('addMovie')}${icon('arrow',15)}</button></form><form class="panel studio-form" data-resource="showtimes"><h2>${t('addShowtime')}</h2>${selectField('movie_id','movie',state.movies.filter(m=>m.is_active),'title')}${selectField('hall_id','hall',halls,'name')}<div class="form-grid">${field('starts_at','startsAt','datetime-local','required')}${field('ticket_price','price','number','required min="0.01" step="0.01"')}</div><p class="form-help">${t('dateHelp')}</p><button type="submit" class="button">${t('addShowtime')}${icon('calendar',15)}</button></form><form class="panel studio-form" data-resource="halls"><h2>${t('addHall')}</h2>${field('name','hallName','text','required maxlength="200"')}${field('capacity','capacity','number','required min="1"')}<button type="submit" class="button">${t('addHall')}${icon('arrow',15)}</button></form><form class="panel studio-form" data-resource="seats"><h2>${t('addSeat')}</h2>${selectField('seat_hall_id','hall',halls,'name')}<div class="form-grid">${field('row_number','row','number','required min="1"')}${field('seat_number','seat','number','required min="1"')}</div><button type="submit" class="button">${t('addSeat')}${icon('seat',15)}</button></form>${state.user.role==='Admin'?`<div class="panel full-width"><h2>${t('users')}</h2>${users.map(user=>`<form class="role-form" data-user-id="${user.id}" style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:15px 0;border-top:1px solid var(--line)"><div style="flex:1;min-width:160px"><strong>${esc(user.full_name)}</strong><div class="form-help">${esc(user.email)}</div></div><label><span class="sr-only">${t('role')} ${esc(user.full_name)}</span><select name="role" style="width:auto;min-width:150px">${['Customer','CinemaManager','Admin'].map(role=>`<option value="${role}" ${user.role===role?'selected':''}>${roleLabel(role)}</option>`).join('')}</select></label><button class="button small secondary" type="submit">${t('changeRole')}</button></form>`).join('')}</div>`:''}</div></section>`;
}

async function renderPage(revision) {
  const route=location.hash.slice(1) || '/films';
  main.innerHTML=`<div class="loading-state"><span class="loading-reel"></span>${t('loading')}</div>`;
  let html;
  try {
    if(route==='/films' || route==='/') html=await filmsPage();
    else if(route==='/showtimes') html=await schedulePage();
    else if(/^\/movie\/\d+$/.test(route)) html=await moviePage(Number(route.split('/')[2]));
    else if(/^\/seats\/\d+$/.test(route)) html=await seatsPage(Number(route.split('/')[2]), revision);
    else if(route==='/tickets') html=await ticketsPage();
    else if(route==='/account') html=await accountPage();
    else if(route==='/studio') html=await studioPage();
    else html=`<section class="container page-content">${empty(t('notFoundTitle'),t('notFoundText'),routeButton('/films',t('explore')))}</section>`;
  } catch(error) {
    html=`<section class="container page-content">${empty(t('errorTitle'),error.message,`<button class="button" data-action="retry">${t('retry')}</button>`)}</section>`;
  }
  if(revision!==state.revision) return;
  main.innerHTML=html;main.classList.remove('view-enter');void main.offsetWidth;main.classList.add('view-enter');
  renderChrome();
  document.title=`${t(route==='/tickets'?'tickets':route==='/account'?'account':route==='/studio'?'studio':route.startsWith('/seats')?'chooseSeats':route==='/showtimes'?'schedule':'films')} — Cinemax`;
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function changePage(animate=true) {
  const revision=++state.revision;
  const stage=document.querySelector('#curtains');
  main.inert=true;
  const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(animate && motion) {stage.classList.add('active');requestAnimationFrame(()=>stage.classList.add('closed'));await pause(490);}
  if(revision!==state.revision) return;
  await renderPage(revision);
  if(revision!==state.revision) return;
  main.inert=Boolean(document.querySelector('.modal'));
  window.scrollTo({top:0,behavior:'instant'});
  if (!main.inert) main.focus({preventScroll:true});
  stage.classList.remove('closed');
  setTimeout(()=>{if(revision===state.revision) stage.classList.remove('active');},550);
}
function go(route) {
  closeModal();
  if(location.hash==='#'+route) changePage(false); else location.hash=route;
}

let previousFocus=null;
function showModal(content,label) {
  if (!document.querySelector('.modal')) previousFocus=document.activeElement;
  document.querySelector('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(label)}"><button class="icon-button close-modal" data-action="close-modal" aria-label="${t('close')}">${icon('close',15)}</button>${content}</section></div>`;
  document.body.style.overflow='hidden';
  document.querySelector('#main').inert=true;document.querySelector('#header').inert=true;document.querySelector('#footer').inert=true;
  document.querySelector('.modal input, .modal button:not(.close-modal)')?.focus();
}
function closeModal() {
  document.querySelector('#modal-root').innerHTML='';document.body.style.overflow='';
  main.inert=false;document.querySelector('#header').inert=false;document.querySelector('#footer').inert=false;
  previousFocus?.isConnected && previousFocus.focus();previousFocus=null;
}
function openAuth(mode='login') {
  const signup=mode==='signup';
  showModal(`<p class="eyebrow">CINEMAX</p><h2>${t(signup?'signupTitle':'loginTitle')}</h2><p class="modal-intro">${t(signup?'signupIntro':'loginIntro')}</p><div class="auth-tabs"><button data-auth-tab="login" class="${!signup?'active':''}">${t('signin')}</button><button data-auth-tab="signup" class="${signup?'active':''}">${t('signup')}</button></div><form id="auth-form" data-mode="${mode}">${signup?field('auth_name','name','text','required maxlength="100" autocomplete="name"'):''}${field('auth_email','email','email','required autocomplete="email"')}${field('auth_password','password','password',`required minlength="${signup?8:1}" maxlength="128" autocomplete="${signup?'new-password':'current-password'}"`)}${signup?`<p class="form-help">${t('passwordHelp')}</p>`:''}<div class="form-error" id="auth-error" role="alert"></div><button type="submit" class="button full">${t(signup?'signupAction':'loginAction')}${icon('arrow',16)}</button></form>`,t(signup?'signup':'signin'));
}
async function submitAuth(form) {
  const signup=form.dataset.mode==='signup',button=form.querySelector('[type=submit]');
  const email=form.querySelector('#auth_email').value.trim(),password=form.querySelector('#auth_password').value;
  button.disabled=true;button.textContent=t('working');document.querySelector('#auth-error').textContent='';
  try {
    if(signup) await api('/auth/register',{method:'POST',body:{full_name:form.querySelector('#auth_name').value.trim(),email,password}});
    const token=await api('/auth/login',{method:'POST',body:new URLSearchParams({username:email,password})});
    state.token=token.access_token;writeSetting('cinema-token',state.token,true);
    state.user=await api('/users/me');closeModal();renderChrome();toast(t(signup?'registered':'welcome'),true);await changePage(false);
  } catch(error) {
    const target=document.querySelector('#auth-error');if(target) target.textContent=error.message; else toast(error.message);
  } finally {if(button.isConnected){button.disabled=false;button.innerHTML=`${t(signup?'signupAction':'loginAction')}${icon('arrow',16)}`;}}
}
async function submitBooking() {
  if(state.busy) return;
  if(!state.selectedSeat) return toast(t('selectSeatFirst'));
  if(!state.user) return openAuth();
  if(state.user.role!=='Customer') return toast(t('customerOnly'));
  state.busy=true;document.querySelector('#booking-summary').innerHTML=bookingSummary();
  try {
    await api('/tickets',{method:'POST',body:{showtime_id:state.currentShow.id,seat_id:state.selectedSeat.id}});
    state.selectedSeat=null;state.ticketPage=1;state.ticketStatus='booked';toast(t('bookingSuccess'),true);go('/tickets');
  } catch(error) {state.selectedSeat=null;toast(error.message);await changePage(false);}
  finally {state.busy=false;const summary=document.querySelector('#booking-summary');if(summary) summary.innerHTML=bookingSummary();}
}
function cancelDialog(id) {
  showModal(`<p class="eyebrow">${t('tickets')}</p><h2>${t('cancelTitle')}</h2><p class="modal-intro">${t('cancelText')}</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="button danger" data-confirm-cancel="${id}">${t('confirmCancel')}</button><button class="button secondary" data-action="close-modal">${t('keepTicket')}</button></div>`,t('cancelTitle'));
}
async function submitStudio(form) {
  const button=form.querySelector('[type=submit]'),resource=form.dataset.resource;
  const data=Object.fromEntries(new FormData(form));
  let path='/'+resource;
  for(const key of ['duration_minutes','capacity','movie_id','hall_id','row_number','seat_number']) if(key in data) data[key]=Number(data[key]);
  if(resource==='seats'){path=`/halls/${Number(data.seat_hall_id)}/seats`;delete data.seat_hall_id;}
  if(resource==='showtimes') data.starts_at=new Date(data.starts_at).toISOString();
  button.disabled=true;
  try {await api(path,{method:'POST',body:data});state.catalogLoaded=false;toast(t('created'),true);await changePage(false);}
  catch(error){toast(error.message);button.disabled=false;}
}

document.addEventListener('click', async event => {
  const target=event.target.closest('button,a');
  if(!target || target.disabled) return;
  if(target.classList.contains('skip-link')){event.preventDefault();main.focus();return;}
  if(target.dataset.route){event.preventDefault();go(target.dataset.route);return;}
  if(target.dataset.lang){state.lang=target.dataset.lang;writeSetting('cinema-language',state.lang);renderChrome();await changePage(false);return;}
  if(target.dataset.genre!==undefined){state.genre=target.dataset.genre;document.querySelectorAll('[data-genre]').forEach(chip=>chip.classList.toggle('active',chip.dataset.genre===state.genre));document.querySelector('#film-grid').innerHTML=filmGrid();return;}
  if(target.dataset.day){state.day=target.dataset.day;document.querySelector('#date-strip').innerHTML=dateButtons();document.querySelector('#schedule-results').innerHTML=scheduleResults();return;}
  if(target.dataset.seat){const id=Number(target.dataset.seat);const seat=state.currentMap?.rows.flatMap(row=>row.seats).find(seat=>seat.id===id);if(!seat||seat.status!=='available')return;state.selectedSeat=state.selectedSeat?.id===id?null:seat;document.querySelectorAll('[data-seat]').forEach(button=>{const selected=Number(button.dataset.seat)===state.selectedSeat?.id;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});document.querySelector('#booking-summary').innerHTML=bookingSummary();return;}
  if(target.dataset.ticketStatus!==undefined){state.ticketStatus=target.dataset.ticketStatus;state.ticketPage=1;await changePage(false);return;}
  if(target.dataset.ticketPage){state.ticketPage=Number(target.dataset.ticketPage);await changePage(false);return;}
  if(target.dataset.authTab){openAuth(target.dataset.authTab);return;}
  if(target.dataset.cancelTicket){cancelDialog(Number(target.dataset.cancelTicket));return;}
  if(target.dataset.confirmCancel){target.disabled=true;try{await api(`/tickets/${Number(target.dataset.confirmCancel)}/cancel`,{method:'POST'});closeModal();toast(t('cancelledSuccess'),true);await changePage(false);}catch(error){toast(error.message);target.disabled=false;}return;}
  switch(target.dataset.action){
    case 'theme': document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';writeSetting('cinema-theme',document.documentElement.dataset.theme);document.querySelector('meta[name=theme-color]').content=document.documentElement.dataset.theme==='dark'?'#100f11':'#f7f4ef';renderChrome();break;
    case 'login':openAuth();break;
    case 'close-modal':closeModal();break;
    case 'logout':state.token='';state.user=null;writeSetting('cinema-token','',true);toast(t('signedOut'));go('/films');break;
    case 'retry':state.catalogLoaded=false;await changePage(false);break;
    case 'reset-films':state.genre='';state.search='';await changePage(false);break;
    case 'explore':event.preventDefault();document.querySelector('#program')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});break;
    case 'book':await submitBooking();break;
  }
});
document.addEventListener('input',event=>{if(event.target.id==='film-search'){state.search=event.target.value;document.querySelector('#film-grid').innerHTML=filmGrid();}});
document.addEventListener('change',event=>{
  if(event.target.id==='schedule-hall')state.scheduleHall=event.target.value;
  else if(event.target.id==='schedule-movie')state.scheduleMovie=event.target.value;
  else return;
  document.querySelector('#schedule-results').innerHTML=scheduleResults();
});
document.addEventListener('submit',async event=>{
  const form=event.target;
  if(!form.matches('#auth-form,#profile-form,.studio-form,.role-form'))return;
  event.preventDefault();
  if(form.id==='auth-form')return submitAuth(form);
  if(form.classList.contains('studio-form'))return submitStudio(form);
  const button=form.querySelector('[type=submit]');button.disabled=true;
  try{
    if(form.id==='profile-form'){
      state.user=await api('/users/me',{method:'PATCH',body:{full_name:form.elements.full_name.value.trim(),email:form.elements.email.value.trim()}});
      toast(t('profileSaved'),true);renderChrome();await changePage(false);
    }else{
      await api(`/users/${Number(form.dataset.userId)}/role`,{method:'PATCH',body:{role:form.elements.role.value}});
      state.user=await api('/users/me');toast(t('roleSaved'),true);await changePage(false);
    }
  }catch(error){toast(error.message);button.disabled=false;}
});
document.addEventListener('click',event=>{if(event.target.classList.contains('modal-backdrop'))closeModal();});
document.addEventListener('keydown',event=>{
  const modal=document.querySelector('.modal');if(!modal)return;
  if(event.key==='Escape'){closeModal();return;}
  if(event.key==='Tab'){
    const focusable=[...modal.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]')];
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
  }
});
window.addEventListener('hashchange',()=>changePage());
async function start(){
  renderChrome();
  if(state.token){try{state.user=await api('/users/me');}catch(error){toast(error.message);}}
  await changePage(false);
}
start();
