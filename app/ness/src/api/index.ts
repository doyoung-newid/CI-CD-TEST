import ky from 'ky';

const api = ky.create({
    // https://github.com/sindresorhus/ky -  ky문서 (fetch 기반 라이브러리)
    prefixUrl: import.meta.env.VITE_API_URL,
    timeout: 30000,
});

export default api;
