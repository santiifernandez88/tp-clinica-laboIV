import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, listAll, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

  constructor(private storage: Storage) { }

  subirImg(file: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const imgRef = ref(this.storage, `fotos/${Date.now()}-${file.name}`);
      uploadBytes(imgRef, file)
        .then(res => getDownloadURL(imgRef))
        .then(url => {
          //console.log("Subida", file);
          resolve(url);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
