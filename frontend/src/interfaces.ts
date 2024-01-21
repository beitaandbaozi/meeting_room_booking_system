import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 3000,
});

// todo axios 对 400、500的信息，都会抛出错误处理
// todo 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error.response;
  }
);

export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", { username, password });
}
