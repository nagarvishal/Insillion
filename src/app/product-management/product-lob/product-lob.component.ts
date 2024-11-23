import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonserviceService } from '../../user-management/services/commonservice.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-lob',
  templateUrl: './product-lob.component.html',
  styleUrl: './product-lob.component.css'
})
export class ProductLobComponent {
  form: any;
  is_clicked: boolean = false;
  lobdata: any = [];
  is_edith: boolean = false;
  cproduct_group_id :string = "";
  constructor(public fb: FormBuilder, public service: CommonserviceService,private messageService: MessageService,private router:Router) {
    this.setFormValue();
  }
  setFormValue() {
    this.form = this.fb.group({
      product_group_name: ['', Validators.required],
      product_group_code: ['', [Validators.required]],
      seq_no_min_length: [11, [Validators.required]],
      renewal_preprocess: ['', []],
      renewal_validator: ['', []], 
      renewal_count_in_policy_no: [false, []],
      payment_after_effective_date: [0, []],
      enable_quote_no: [false, []],
      quote_no_prefix: ['', []],
      quote_no_suffix: ['', []],
      quote_no_seqkey: ['', []],
      quote_donot_reset: [false, []],
      quote_no_version: ['', []],
      quote_id_version: ['', []],
      enable_proposal_no: [false, []],
      proposal_no_prefix: ['', []],
      proposal_no_suffix: ['', []],
      proposal_no_seqkey: ['', []],
      proposal_donot_reset: [false, []],
      enable_policy_no: [0, []],
      policy_no_prefix: ['', []],
      policy_no_suffix: ['', []],
      policy_no_seqkey: ['', []],
      policy_donot_reset: [false, []],
      policy_no_url: ['', []],
      policy_no_url_method: ['', []],
      policy_no_url_auth: ['', []],
      enable_endorsement_no: [0, []],
      endorsement_no_prefix: ['', []],
      endorsement_no_suffix: ['', []],
      endorsement_no_seqkey: ['', []],
      endorsement_donot_reset: [false, []],
      endorsement_no_url: ['', []],
      endorsement_no_url_method: ['', []],
      endorsement_no_url_auth: ['', []],
      endorsement_count_in_policy_no: ['', []],
      need_signed_proposal: [0, []],
      need_agreement: ['', []],
      agreement_tandc: ['', []],
      renewal_min_days: ['', []],
      renewal_max_days: ['', []],
      minimum_premium_value: [0, []],
      enable_installments: ['', []],
      max_emi_count: [0, []],
      emi_setup_fee: [0, []],
      emi_setup_fee_percent: [0, []],
      emi_fee_tax_module: ['', []],
      late_fee_per_day: [0, []],
      late_fee: [0, []],
      suspend_after: [0, []],
      installment_alignment: ['', []],
      tax_module: ['', []],
      ignore_tax: ['', []],
      update_tax: ['', []],
      status: ['', []],
      nstp_assign_proc: ['', []],
    })
    this.form.get('quote_donot_reset')?.disable();
    this.form.get('quote_no_prefix')?.disable();
    this.form.get('quote_no_seqkey')?.disable();
    this.form.get('quote_no_suffix')?.disable();
    this.form.get('quote_donot_reset')?.disable();
    this.form.get('quote_no_version')?.disable();
    this.form.get('quote_id_version')?.disable();
    this.form.get('proposal_donot_reset')?.disable();
    this.form.get('proposal_no_prefix')?.disable();
    this.form.get('proposal_no_seqkey')?.disable();
    this.form.get('proposal_no_suffix')?.disable();
    this.form.get('proposal_donot_reset')?.disable();
    this.fetchlobdata();
  }
  setEditFormValue(data: any) {
    console.log(data);
    this.form = this.fb.group({
      product_group_name: [data.product_group_name, Validators.required],
      product_group_code: [data.product_group_code, [Validators.required]],
      seq_no_min_length: [data.seq_no_min_length, [Validators.required]],
      renewal_preprocess: [data.renewal_preprocess, []],
      renewal_validator: [data.renewal_validator, []], 
      renewal_count_in_policy_no: [data.renewal_count_in_policy_no?true:false, []],
      payment_after_effective_date: [data.payment_after_effective_date, []],
      enable_quote_no: [data.enable_quote_no ? true : false, []],
      quote_no_prefix: [data.quote_no_prefix, []],
      quote_no_suffix: [data.quote_no_suffix, []],
      quote_no_seqkey: [data.quote_no_seqkey, []],
      quote_donot_reset: [data.quote_donot_reset ? true : false, []],
      quote_no_version: [data.quote_no_version, []],
      quote_id_version: [data.quote_id_version, []],
      enable_proposal_no: [data.enable_proposal_no ? true : false, []],
      proposal_no_prefix: [data.proposal_no_prefix, []],
      proposal_no_suffix: [data.proposal_no_suffix, []],
      proposal_no_seqkey: [data.proposal_no_seqkey, []],
      proposal_donot_reset: [data.proposal_donot_reset ? true : false, []],
      enable_policy_no: [data.enable_policy_no, []],
      policy_no_prefix: [data.policy_no_prefix, []],
      policy_no_suffix: [data.policy_no_suffix, []],
      policy_no_seqkey: [data.policy_no_seqkey, []],
      policy_donot_reset: [data.policy_donot_reset ? true : false, []],
      policy_no_url: [data.policy_no_url, []],
      policy_no_url_method: [data.policy_no_url_method, []],
      policy_no_url_auth: [data.policy_no_url_auth, []],
      enable_endorsement_no: [data.enable_endorsement_no, []],
      endorsement_no_prefix: [data.endorsement_no_prefix, []],
      endorsement_no_suffix: [data.endorsement_no_suffix, []],
      endorsement_no_seqkey: [data.endorsement_no_seqkey, []],
      endorsement_donot_reset: [data.endorsement_donot_reset ? true : false, []],
      endorsement_no_url: [data.endorsement_no_url, []],
      endorsement_no_url_method: [data.endorsement_no_url_method, []],
      endorsement_no_url_auth: [data.endorsement_no_url_auth, []],
      endorsement_count_in_policy_no: [data.endorsement_count_in_policy_no, []],
      need_signed_proposal: [data.need_signed_proposal, []],
      need_agreement: [data.need_agreement, []],
      agreement_tandc: [data.agreement_tandc, []],
      renewal_min_days: [data.renewal_min_days, []],
      renewal_max_days: [data.renewal_max_days, []],
      minimum_premium_value: [data.minimum_premium_value, []],
      enable_installments: [data.enable_installments ? true : false, []],
      max_emi_count: [data.max_emi_count, []],
      emi_setup_fee: [data.emi_setup_fee, []],
      emi_setup_fee_percent: [data.emi_setup_fee_percent, []],
      emi_fee_tax_module: [data.emi_fee_tax_module, []],
      late_fee_per_day: [data.late_fee_per_day, []],
      late_fee: [data.late_fee, []],
      suspend_after: [data.suspend_after, []],
      installment_alignment: [data.installment_alignment, []],
      tax_module: [data.tax_module, []],
      ignore_tax: [data.ignore_tax, []],
      update_tax: [data.update_tax, []],
      status: [data.status, []],
      nstp_assign_proc: [data.nstp_assign_proc, []],
    })
  }
  get prgroupform(){
    return this.form.controls;
  }
  __add_lob() {
    let headers: any = this.service.creatHeader();
    let request: any = {
      product_group_name: this.form.value.product_group_name ? this.form.value.product_group_name : "",
      product_group_code: this.form.value.product_group_code ? this.form.value.product_group_code : "",
      seq_no_min_length: this.form.value.seq_no_min_length ? this.form.value.seq_no_min_length : 11,
      renewal_preprocess: this.form.value.renewal_preprocess ? this.form.value.renewal_preprocess : "",
      renewal_validator: this.form.value.renewal_validator ? this.form.value.renewal_validator : "",
      renewal_count_in_policy_no: this.form.value.renewal_count_in_policy_no ? 1 : 0,
      payment_after_effective_date: this.form.value.payment_after_effective_date ? Number(this.form.value.payment_after_effective_date) : 0,
      enable_quote_no: this.form.value.enable_quote_no ? 1 : 0,
      quote_no_prefix: this.form.value.quote_no_prefix ? this.form.value.quote_no_prefix : "",
      quote_no_suffix: this.form.value.quote_no_suffix ? this.form.value.quote_no_suffix : "",
      quote_no_seqkey: this.form.value.quote_no_seqkey ? this.form.value.quote_no_seqkey : "",
      quote_donot_reset: this.form.value.quote_donot_reset ? 1 : 0,
      quote_no_version: this.form.value.quote_no_version ? this.form.value.quote_no_version : "",
      quote_id_version: this.form.value.quote_id_version ? this.form.value.quote_id_version : "",
      enable_proposal_no: this.form.value.enable_proposal_no ? 1 : 0,
      proposal_no_prefix: this.form.value.proposal_no_prefix ? this.form.value.proposal_no_prefix : "",
      proposal_no_suffix: this.form.value.proposal_no_suffix ? this.form.value.proposal_no_suffix : "",
      proposal_no_seqkey: this.form.value.proposal_no_seqkey ? this.form.value.proposal_no_seqkey : "",
      proposal_donot_reset: this.form.value.proposal_donot_reset ? 1 : 0,
      enable_policy_no: this.form.value.enable_policy_no ? Number(this.form.value.enable_policy_no) : 0,
      policy_no_prefix: this.form.value.policy_no_prefix ? this.form.value.policy_no_prefix : "",
      policy_no_suffix: this.form.value.policy_no_suffix ? this.form.value.policy_no_suffix : "",
      policy_no_seqkey: this.form.value.policy_no_seqkey ? this.form.value.policy_no_seqkey : "",
      policy_donot_reset: this.form.value.policy_donot_reset ? 1 : 0,
      policy_no_url: this.form.value.policy_no_url ? this.form.value.policy_no_url : "",
      policy_no_url_method: this.form.value.policy_no_url_method ? this.form.value.policy_no_url_method : "",
      policy_no_url_auth: this.form.value.policy_no_url_auth ? this.form.value.policy_no_url_auth : "",
      enable_endorsement_no: this.form.value.enable_endorsement_no ? Number(this.form.value.enable_endorsement_no) : 0,
      endorsement_no_prefix: this.form.value.endorsement_no_prefix ? this.form.value.endorsement_no_prefix : "",
      endorsement_no_suffix: this.form.value.endorsement_no_suffix ? this.form.value.endorsement_no_suffix : "",
      endorsement_no_seqkey: this.form.value.endorsement_no_seqkey ? this.form.value.endorsement_no_seqkey : "",
      endorsement_donot_reset: this.form.value.endorsement_donot_reset ? 1 : 0,
      endorsement_no_url: this.form.value.endorsement_no_url ? this.form.value.endorsement_no_url : "",
      endorsement_no_url_method: this.form.value.endorsement_no_url_method ? this.form.value.endorsement_no_url_method : "",
      endorsement_no_url_auth: this.form.value.endorsement_no_url_auth ? this.form.value.endorsement_no_url_auth : "",
      endorsement_count_in_policy_no: this.form.value.endorsement_count_in_policy_no ? this.form.value.endorsement_count_in_policy_no : "",
      need_signed_proposal: this.form.value.need_signed_proposal ? this.form.value.need_signed_proposal : 0,
      need_agreement: this.form.value.need_agreement ? this.form.value.need_agreement : 0,
      agreement_tandc: this.form.value.agreement_tandc ? this.form.value.agreement_tandc : 0,
      renewal_min_days: this.form.value.renewal_min_days ? this.form.value.renewal_min_days : 0,
      renewal_max_days: this.form.value.renewal_max_days ? this.form.value.renewal_max_days : 0,
      minimum_premium_value: this.form.value.minimum_premium_value ? this.form.value.minimum_premium_value : 0,
      enable_installments: this.form.value.enable_installments ? 1 : 0,
      max_emi_count: this.form.value.max_emi_count ? this.form.value.max_emi_count : 0,
      emi_setup_fee: this.form.value.emi_setup_fee ? this.form.value.emi_setup_fee : 0,
      emi_setup_fee_percent: this.form.value.emi_setup_fee_percent ? this.form.value.emi_setup_fee_percent : 0,
      emi_fee_tax_module: this.form.value.emi_fee_tax_module ? this.form.value.emi_fee_tax_module : "",
      late_fee_per_day: this.form.value.late_fee_per_day ? this.form.value.late_fee_per_day : 0,
      late_fee: this.form.value.late_fee ? this.form.value.late_fee : 0,
      suspend_after: this.form.value.suspend_after ? this.form.value.suspend_after : 0,
      installment_alignment: this.form.value.installment_alignment ? this.form.value.installment_alignment : 0,
      tax_module: this.form.value.tax_module ? this.form.value.tax_module : "",
      ignore_tax: this.form.value.ignore_tax ? this.form.value.ignore_tax : 0,
      update_tax: this.form.value.update_tax ? this.form.value.update_tax : 0,
      nstp_assign_proc: this.form.value.nstp_assign_proc ? this.form.value.nstp_assign_proc : ""
    }
    if(this.is_edith==true){
        this.service.putAPICall(environment.Url+`/api/v1/products/product_lob?product_group_id=${this.cproduct_group_id}`,request,headers).subscribe({
        next: (response) => {
            this.showSuccess(JSON.stringify(response));
        },
        error: (error) => {
          this.service.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
        },
        complete: () => {
            console.log('this function is complete');
        }
       })
    }else{
        this.service.postAPICall(environment.Url+"/api/v1/products/product_lob",request,headers).subscribe({
        next: (response) => {
            this.showSuccess(JSON.stringify(response));
        },
        error: (error) => {
            this.service.showError(JSON.stringify(error.error.desc));
            if(error.error.status==-106){
              this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
            }
        },
        complete: () => {
            console.log('this function is complete');
        }
       })
    }
  }
  quoteclick(enable_quote_no: any, donotresetquote: any) {
    if (enable_quote_no.checked) {
      this.form.get('quote_donot_reset')?.enable();
      this.form.get('quote_no_prefix')?.enable();
      this.form.get('quote_no_seqkey')?.enable();
      this.form.get('quote_no_suffix')?.enable();
      this.form.get('quote_donot_reset')?.enable();
      this.form.get('quote_no_version')?.enable();
      this.form.get('quote_id_version')?.enable();
    } else {
      donotresetquote.checked = false;
      this.form.get('quote_donot_reset')?.disable();
      this.form.get('quote_no_prefix')?.disable();
      this.form.get('quote_no_seqkey')?.disable();
      this.form.get('quote_no_suffix')?.disable();
      this.form.get('quote_donot_reset')?.disable();
      this.form.get('quote_no_version')?.disable();
      this.form.get('quote_id_version')?.disable();
    }
  }
  proposalclick(enable_proposal_no: any, donotresetproposal: any) {
    if (enable_proposal_no.checked) {
      this.form.get('proposal_donot_reset')?.enable();
      this.form.get('proposal_no_prefix')?.enable();
      this.form.get('proposal_no_seqkey')?.enable();
      this.form.get('proposal_no_suffix')?.enable();
      this.form.get('proposal_donot_reset')?.enable();
    } else {
      donotresetproposal.checked = false;
      this.form.get('proposal_donot_reset')?.disable();
      this.form.get('proposal_no_prefix')?.disable();
      this.form.get('proposal_no_seqkey')?.disable();
      this.form.get('proposal_no_suffix')?.disable();
      this.form.get('proposal_donot_reset')?.disable();
    }
  }
  fetchlobdata() {
    let url = environment.Url+`/api/v1/products/product_lob`;
    let headers = this.service.creatHeader();
    this.service.getAPICall(url, headers).subscribe({
      next: (response) => {
        this.lobdata = response;
      },
      error: (error) => {
          this.service.showError(JSON.stringify(error.error.desc));
          if(error.error.status==-106){
            this.router.navigate(["/login"],{queryParams:{redirect:"true",desc:JSON.stringify(error.error.desc)}});
          }
      },
      complete: () => {
        console.log('this function is complete');
      }
    })

  }
  onSelectChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue == "") {
      this.is_edith = false;
      this.setFormValue();
    }
    else {
      this.is_edith = true;
      this.cproduct_group_id = this.lobdata[Number(selectedValue)]["product_group_id"]
      this.setEditFormValue(this.lobdata[Number(selectedValue)]);
    }
  }
  showSuccess(message:string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }
}
