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
      'http://127.0.0.1:5000/gaussian',
      {
        x_dim: 9,
        y_dim: 9,
        center_x: 4,
        center_y: 5,
        fwhm_x: 3,
        fwhm_y: 2,
        theta: 0.3
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

  make2dArray(rows, cols) {
    let arr = new Array(rows);
    for (let r = 0; r < rows; r++) {
      arr[r] = new Array(cols);
    }
    return arr;
  }


  createOnes(rows, cols) {
    let result = new Array(rows);
    for (let r = 0; r < rows; r++) {
      result[r] = new Array(cols);
      for (let c = 0; c < cols; c++) {
        result[r][c] = new Array(3);
        for (let d = 0; d < 3; d++) {
          result[r][c][d] = 1;
        }
      }
    }
    return result;
  }

  applyLut(matrix) {
    let color;
    let result = matrix.slice();
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        color = i/matrix.length * j/matrix[i].length * 255;
        result[i][j][0] *= color;
        result[i][j][1] *= color;
        result[i][j][2] *= color;
      }
    }
    return result
  }

  applyLut2(matrix) {
    return matrix.map(
      (row) => {
        row.map((col) => {
          col.map((x) => x * 5)
        })
      })
  }
}
