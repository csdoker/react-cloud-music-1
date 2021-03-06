
import axios from "axios";
import qs from "qs";
import config from "../config";
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  config => {
    // loading
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.resolve(error.response);
  }
);

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (
    response &&
    (response.status === 200 ||
      response.status === 304 ||
      response.status === 400 ||
      response.status === 401)
  ) {
    if (response.data.code === 200) {
      return response.data;
      // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    if (response.status * 1 === 401) {
      return response.data;
    }
    return response.data;
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: "网络异常"
  };
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
  }
  if (res.data && !res.data.success) {
  }
  return res;
}
function postByToken(url, data, token) {
  // let headers = {
  //   "X-Requested-With": "XMLHttpRequest",
  //   "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  //   authorization: token
  // };
  return axios({
    method: "post",
    baseURL: config.api,
    url,
    data: qs.stringify(data),
    timeout: 20000,
    // headers
  })
    .then(response => {
      return checkStatus(response);
    })
    .then(res => {
      return checkCode(res);
    });
}
export default {
  post(url, data) {
    return postByToken(url, data);
  },
  get(url, params) {
    let headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json; charset=UTF-8",
      };
    return axios({
      method: "get",
      baseURL: config.api,
      url,
      params,
      // get 请求时带的参数
      timeout: 10000,
      headers
    })
      .then(response => {
        return checkStatus(response);
      })
      .then(res => {
        return checkCode(res);
      })
      .catch(err => {
        if (err) {
        }
      });
  }
};
