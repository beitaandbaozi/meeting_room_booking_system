import axios from "axios";
import { RegisterUser } from "./register";
import { UpdatePassword } from "./update-password";

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

// todo 登录
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", { username, password });
}

// todo 注册验证码发送
export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register-captcha", {
    params: {
      address: email,
    },
  });
}

// todo 注册
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

// todo 修改密码邮件验证
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get('/user/update_password/captcha', {
      params: {
          address: email
      }
  });
}

// todo 修改密码
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post('/user/update_password', data);
}
