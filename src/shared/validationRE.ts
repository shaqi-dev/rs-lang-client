export const RE_EMAIL = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/gm;

export const RE_USERNAME = /^[a-zA-Z0-9_-]{3,15}$/gm;

export const RE_PASSWORD = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/gm;
