import {Component, EventEmitter, OnInit} from '@angular/core';
import {UploaderOptions, UploadFile, UploadInput, UploadOutput, humanizeBytes} from 'ngx-uploader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-input-screen',
  templateUrl: './input-screen.component.html',
  styleUrls: ['./input-screen.component.scss']
})
export class InputScreenComponent implements OnInit {

  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  fileReady: EventEmitter<any> = new EventEmitter();
  projectFileReady: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router) {
    this.options = {
      concurrency: 1,
      maxUploads: 1,
      allowedContentTypes: ['application/json']
    };
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.fileReady.subscribe((file) => {
      localStorage.setItem('fileInput', JSON.stringify(file));
      this.router.navigate(['/editor']);
    }, (err) => {
      console.error(err);
    });
    this.projectFileReady.subscribe((file) => {
      localStorage.setItem('projectInput', JSON.stringify(file));
      this.router.navigate(['/editor/project']);
    }, (err) => {
      console.error(err);
    });
  }

  onUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        console.log(this.files);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          const file: File = output.file.nativeFile;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.files = [JSON.parse(e.target.result)];
            this.fileReady.emit(this.files[0]);
          };
          reader.readAsBinaryString(file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }
  onProjectUploadOutput(output: UploadOutput): void {
    switch (output.type) {
      case 'allAddedToQueue':
        console.log(this.files);
        break;
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          const file: File = output.file.nativeFile;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.files = [JSON.parse(e.target.result)];
            this.projectFileReady.emit(this.files[0]);
          };
          reader.readAsBinaryString(file);
        }
        break;
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          // update current data in files array for uploading file
          const index = this.files.findIndex((file) => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        }
        break;
      case 'removed':
        // remove file from array when removed
        this.files = this.files.filter((file: UploadFile) => file !== output.file);
        break;
      case 'dragOver':
        this.dragOver = true;
        break;
      case 'dragOut':
      case 'drop':
        this.dragOver = false;
        break;
      case 'done':
        // The file is downloaded
        break;
    }
  }
  /*startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: {foo: 'bar'}
    };

    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({type: 'cancel', id: id});
  }

  removeFile(id: string): void {
    this.uploadInput.emit({type: 'remove', id: id});
  }

  removeAllFiles(): void {
    this.uploadInput.emit({type: 'removeAll'});
  }*/

}
