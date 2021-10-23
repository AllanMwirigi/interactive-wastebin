import axios from 'axios';

export class SignInService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL;
    this.config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  }

  logIn(email, password) {
    const url = `${this.baseUrl}/api/v1/users/login`;
    const data = { email, password };
    return axios.post(url, data, this.config);
  }

}
export const signInService = new SignInService();

export class BinsService {
  constructor(authToken, userId){
    this.config = { headers: { authorization: authToken, userId } };
  }

  createBin = (data) => {
    return axios.post('/api/v1/bins/', data, this.config);
  }

  getAllBins = () => {
    return axios.get('/api/v1/bins/', this.config);
  }

  getBin = (binId) =>{
    return axios.get(`/api/v1/bins/${binId}`, this.config);
  }

  updateBin = (binId, data) => {
    return axios.put(`/api/v1/bins/${binId}`, data, this.config);
  }

  setBinEmptied = (binId, data) => {
    return axios.post(`/api/v1/bins/${binId}/emptied`, data, this.config);
  }

  deleteBin = (binId) => {
    return axios.delete(`/api/v1/bins/${binId}`, this.config);
  }

}
