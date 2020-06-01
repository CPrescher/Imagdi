import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NumpyLoader } from './numpy-loader';

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  imageChanged = new EventEmitter<any>();
  image;
  imageData;

  constructor(
    private http: HttpClient
  ) {
  }

  getRandomImage() {
    let startTime = performance.now();

    this.http.post(
      'http://127.0.0.1:5000/random',
      {
        x_dim: 1024,
        y_dim: 1024
      }, {responseType: 'arraybuffer'})
      .subscribe(responseData => {
        // console.log(responseData);
        this.image = NumpyLoader.fromArrayBuffer(responseData);
        this.imageData = this.reshapeImage(this.image.data, this.image.shape)
        this.imageChanged.emit(this.imageData);
      })
  }

  reshapeImage(data, shape) {
    const rows = shape[0];
    const cols = shape[1]
    let result = [];
    for (let r = 0; r < rows; r++) {
      let row = [];
      for (let c = 0; c < cols; c++) {
        let i = r * cols + c;
        row.push(data[i])
      }
      result.push(row);
    }
    return result;
  }
}
