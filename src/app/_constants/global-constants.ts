import {HttpHeaders} from '@angular/common/http';

export class GlobalConstants {
  public static apiUrl = 'http://localhost:8080/api';

  public static JWT_KEY = 'auth-jwt';
  public static USER_KEY = 'auth-user';
  public static SELECTED_PATIENT = 'selected-patient';

  public static httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}
