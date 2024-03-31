import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "./register";
import { UpdatePassword } from "./update-password";
import { UserInfo } from "./update-userinfo";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005",
  timeout: 3000,
});

// todo axios 对 400、500的信息，都会抛出错误处理
// todo token refresh 处理
// todo 响应拦截器
interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}
let refreshing = false;
const queue: PendingTask[] = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;
    console.log("error", error)
    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }
    //todo 当响应码是 401 的时候，就刷新 token，刷新失败提示错误信息，然后跳到登录页
    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;
      const res = await _refreshToken();
      refreshing = false;
      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });
        return axiosInstance(config);
      } else {
        message.error(res.data);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function _refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}

// todo 请求拦截器
axiosInstance.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken;
  }
  return config;
});

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
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

// todo 修改密码
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/update_password", data);
}

// todo 获取用户信息
export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

// todo 修改用户信息
export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/update", data);
}

// todo 修改用户信息验证码发送
export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/update/captcha");
}
