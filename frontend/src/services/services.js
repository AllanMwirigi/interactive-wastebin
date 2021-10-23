import axios from 'axios';

export class UserService {
  constructor(authToken, userId) {
    this.baseUrl = process.env.REACT_APP_API_URL;
    this.config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        authorization: authToken, userId
      }
    }
  }

  login(email, password) {
    const url = `${this.baseUrl}/users/login`;
    const data = { email, password };
    return axios.post(url, data, this.config);
  }

  getAllUsers() {
    const url = `${this.baseUrl}/users`;
    return axios.get(url, this.config);
  }

}

export class BinsService {
  constructor(authToken, userId) {
    this.baseUrl = process.env.REACT_APP_API_URL;
    this.config = { headers: { authorization: authToken, userId } };
  }

  createBin = (data) => {
    return axios.post(`${this.baseUrl}/bins/`, data, this.config);
  }

  getAllBins = () => {
    return axios.get(`${this.baseUrl}/bins/`, this.config);
  }

  getBin = (binId) =>{
    return axios.get(`${this.baseUrl}/bins/${binId}`, this.config);
  }

  updateBin = (binId, data) => {
    return axios.put(`${this.baseUrl}/bins/${binId}`, data, this.config);
  }

  setBinEmptied = (binId, data) => {
    return axios.post(`${this.baseUrl}/bins/${binId}/emptied`, data, this.config);
  }

  deleteBin = (binId) => {
    return axios.delete(`${this.baseUrl}/bins/${binId}`, this.config);
  }

}
