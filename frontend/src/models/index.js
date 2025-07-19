import axios from "axios";

export const PublicApi = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 40000,
    headers: {
        "Content-Type": "application/json"
    }
});

export const AuthApi = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 20000,
    withCredentials: true
})
export const refreshhApi = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 30000,
    withCredentials: true
})

AuthApi.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("kreasiku");

    if (config.url.includes('/refreshToken')) return config;
    
    if (isTokenExpiringSoon(token)) {
        console.log("token expired refresh");
        await refreshAccessToken();
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});


async function refreshAccessToken() {
    try {
        const res = await refreshhApi.get('/refreshToken');
        localStorage.setItem("kreasiku", res.data.token);
        console.log("Access token diperbarui", res.data.token);
    } catch (err) {
        console.error(err);
        window.location.href = "/login";
    }
}

function isTokenExpiringSoon(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    const now = Date.now() / 1000;
    return exp - now < 60;
}
