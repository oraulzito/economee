import {HttpHeaders} from "@angular/common/http";

httpHeaderOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.sessionQuery.getValue().key
      })
    };
  }
