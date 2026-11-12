import ru from './ru';
import en from './en';

export type Lang = 'ru' | 'en';
export const GH = 'https://github.com/Zumka1991/feather-de';
export const langOf = (param?: string): Lang => (param === 'en' ? 'en' : 'ru');
export const t = (lang: Lang) => (lang === 'en' ? en : ru);
/** Путь страницы с учётом языка: href('en', '/guide/') → '/en/guide/'. */
export const href = (lang: Lang, path: string) => (lang === 'en' ? `/en${path}` : path);
/** Обе языковые версии каждой страницы. */
export const langPaths = () => [{ params: { lang: undefined } }, { params: { lang: 'en' } }];
