# Сайт Пёрышка

Сайт [Пёрышка](https://github.com/Zumka1991/feather-de) на домене [featheros.ru](https://featheros.ru):
статические страницы на [Astro](https://astro.build), русская и английская версии.

## Страницы

| Путь | Что там |
|---|---|
| `/` | Главная: бюджеты, демо режимов рабочего стола, фишки, приложения |
| `/features/` | Все возможности по разделам |
| `/guide/` | Руководство пользователя из `docs/USER_GUIDE.md` |
| `/download/` | Образ ISO, Ubuntu, Arch, требования, вопросы и ответы |
| `/tech/` | Архитектура, бюджеты, протоколы |
| `/changelog/` | История выпусков из `CHANGELOG.md` |
| `/community/` | Форум (GitHub Discussions), баги, поддержка |

Английская версия — те же пути с префиксом `/en/`.

## Работа

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # результат в dist/
```

## Откуда берётся содержимое

- **Тексты страниц** — `src/i18n/ru.ts` и `src/i18n/en.ts` (одинаковая структура).
- **Руководство, выпуски, версия, скриншоты, обои** — переносятся из репозитория `feather-de`:

  ```bash
  npm run sync                       # берёт ../feather-de
  FEATHER_DE=/путь/к/feather-de npm run sync
  ```

  Запускайте после каждого выпуска Пёрышка и коммитьте результат (`src/content`, `src/data`,
  `public/shots`, `public/walls`).
- **Образ ISO** — `src/data/iso.json`: версия, размер, ссылка на SourceForge и SHA-256.
- **Команды установки и giscus** — `src/data/install.json`. Комментарии giscus на странице
  сообщества включаются, когда заполнены `repoId` и `categoryId` (см. <https://giscus.app>).

## Публикация

Сборку и выкладку делает `.github/workflows/deploy.yml` при пуше в `main`. В настройках
репозитория должно стоять Settings → Pages → Source = «GitHub Actions». Домен задаёт
`public/CNAME` (DNS у reg.ru: четыре A-записи GitHub и CNAME `www` → `zumka1991.github.io`).

SEO: `public/robots.txt`, карта сайта создаётся при сборке (`sitemap-index.xml`), превью для
соцсетей — `public/img/og.jpg` (1200×630). Сайт подтверждён в Яндекс.Вебмастере и Google
Search Console через TXT-записи DNS.
