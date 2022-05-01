import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  async login(username: string, password: string) {
    console.log(`Sending request to ${environment.apiURL}/auth/login`)
    await this.http.post(`${environment.apiURL}/auth/login`,{
      userid: username,
      password: password
    }, {
      observe: 'body',
      responseType: 'json'
    }).subscribe((res) => {
      const response = res as any;
      console.log(response.token);
      Object.entries(res).forEach((value, index) => {
        console.log(value[0] + '     ' + value[1])
      })
    })
  }
}
