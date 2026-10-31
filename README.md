# Сайт Пёрышка

Лендинг [Пёрышка](https://github.com/Zumka1991/feather-de): статическая страница без сборки,
публикуется через GitHub Pages из ветки `main` на домене [featheros.ru](https://featheros.ru)
(файл `CNAME`, DNS у reg.ru: четыре A-записи GitHub и CNAME `www` → `zumka1991.github.io`).

- `index.html` — вся страница, стили внутри, внешних шрифтов и библиотек нет.
- `img/` — скриншот рабочего стола и обои в WebP (обои из `feather-de/assets/wallpapers`).
- Образ ISO раздаётся с [SourceForge](https://sourceforge.net/projects/featheros/):
  при выходе новой версии поменять ссылку, размер и SHA-256 в блоке «Попробуйте Пёрышко».

Посмотреть локально: `python3 -m http.server 8765` в этой папке.
