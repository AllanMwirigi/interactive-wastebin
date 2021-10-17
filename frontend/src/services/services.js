import axios from 'axios';
import { getBaseUrl } from '../utils/utils';

class SignInService {
  constructor() {
    this.baseUrl = getBaseUrl();
    this.config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
  }

  logIn(email, password) {
    const url = `${this.baseUrl}/api/v1/login`;
    const data = { email, password };
    return axios.post(url, data, this.config);
  }

}

export const signInService = new SignInService();