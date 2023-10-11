import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ApiService } from '../providers/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  paramForm!: FormGroup;
  records: any[] = [];
  constructor(public api: ApiService, public fb: FormBuilder) {
    this.paramForm = this.fb.group({
      "tagId": ['', Validators.required],
      "fromDateTime": [new Date().toISOString(), Validators.required],
      "toDateTime": [new Date().toISOString(), Validators.required],
    })
  }

  ngOnInit(): void {
  }

  /**
   * @description used to get data from DB
   */
  getDataFromDB() {
    console.log(this.paramForm.value);
    this.api.getStoredDataDump(this.paramForm.value).subscribe((resp: any) => {
      console.log(resp);
      this.records = resp;
      if (resp.length == 0) return;
      let name = this.paramForm.value['tagId'] + "_" + this.paramForm.value['fromDateTime'].split('T')[0] + "_" + this.paramForm.value['toDateTime'].split('T')[0];
      this.api.exportArrayToExcel(resp, name, [this.paramForm.value['fromDateTime'], this.paramForm.value['toDateTime']]);
    }, (err: any) => {
      console.error(err);
    })
  }

  /**
   * @description used to set date to formControls
   * @param e 
   * @param type 
   */
  changeDateTime(e: any, type: string) {
    console.log(e.detail.value);
    if (type == "from") {
      this.paramForm.patchValue({ 'fromDateTime': e.detail.value });
    } else {
      this.paramForm.patchValue({ 'toDateTime': e.detail.value });
    }
  }
}
