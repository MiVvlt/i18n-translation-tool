import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  public inputFile: Object;
  public formFields: any[] = [];

  constructor(public router: Router, public activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activeRoute.data.subscribe((d) => {
      if (d.project) {
        this.formFields = JSON.parse(localStorage.getItem('projectInput'));
        if (!this.formFields) {
          this.router.navigate(['/input-screen']);
        }
      } else {
        this.inputFile = JSON.parse(localStorage.getItem('fileInput'));
        if (!this.inputFile) {
          this.router.navigate(['/input-screen']);
        }
        this.createFormFields(this.inputFile, 'file');
      }
    });
  }

  createFormFields(file: any, parent: string) {
    for (const key in file) {
      if (typeof file[key] === 'string') {
        this.formFields.push({
          parent: `${parent} > ${key}`,
          value: file[key],
          translation: ''
        });
      } else {
        this.createFormFields(file[key], `${parent} > ${key}`);
      }
    }
  }

  createFile() {
    const result: any = {};
    for (const item of this.formFields) {
      const keys: string[] = item.parent.split(' > ');
      this.assign(result, keys, item.translation);
    }
    this.download(JSON.stringify(result), 'translation.json', 'application/json;charset=utf-8');
  }

  createProjectFile() {
    this.download(JSON.stringify(this.formFields), 'translation-project.json', 'application/json;charset=utf-8');
  }

  download(content, fileName, contentType) {
    try {
      const isFileSaverSupported = !!new Blob;
    } catch (e) {
      console.error('FileSave not supported');
    }
    const a: any = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.setAttribute('type', 'hidden');
    a.rel = 'noopener';
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  saveProject() {
    localStorage.setItem('projectInput', JSON.stringify(this.formFields));
    this.router.navigate(['/editor/project']);
  }

  assign(obj, keyPath, value) {
    const lastKeyIndex = keyPath.length - 1;
    for (let i = 0; i < lastKeyIndex; ++i) {
      const key = keyPath[i];
      if (!(key in obj)) {
        obj[key] = {};
      }
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }
}
