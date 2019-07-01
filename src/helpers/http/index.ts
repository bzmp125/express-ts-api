import axios from "axios";
export default class Http {
  constructor() {}

  get(url: string, config: any = null) {
    return new Promise((resolve, reject) => {
      axios
        .get(url, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  post(url: string, data: any, config: any = {}) {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  put(url: string, data: any, config: any = {}) {
    return new Promise((resolve, reject) => {
      axios
        .put(url, data, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  delete(url: string, config: any = {}) {
    return new Promise((resolve, reject) => {
      axios
        .delete(url, config)
        .then(res => {
          resolve(res.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
