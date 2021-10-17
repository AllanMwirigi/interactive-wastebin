import axios from 'axios';

class SignInService {
  constructor() {
    // this.baseUrl = getBaseUrl();
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