import { Component,OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { FormBuilder } from '@angular/forms';
import { GlobalService } from '../../global/global.service';
import { environment } from '../../../environments/environment';

let data = {};
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit{
  currentflow:any = "";
  activestage:number = 0;
  activeflow:number = 0;
  flowname:string = "";
  icontable:boolean = false;
  faicon:string = "bi bi-car-front";
  arr1:any = [];
  currentstage:any = "";
  premodule:any = "";
  currentmodule = "";

  workflow:any = {
    "name": "Product Creation Flow",
    "type": "Product",
    "stages": [
        {
            "name": "Product Details",
            "desc": "Configure Product details",
            "icon": "fa-anchor",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
             "pdf": [
                    { "name":"pep","id_field":"pep","email_template":"pep" }
                ],
            "form":{
                "groups": [
                    {
                        "name" : "Basic Details",
                        "desc": "Basic Details",
                        "fields": [
                            { "field_name": "product_name", "type": "string", "editable": true, "label": "Product Name", "tip": "Product name must be unique", "validate": "required" },
                            { "field_name": "display_name", "type": "string", "editable": true, "label": "Display Name", "tip": "Product display name" },
                            { "field_name": "product_group_id", "type": "lookup", "label": "Line of Business", "tip": "Product group name",
                                "source": { "url":"/api/v1/products/group?fields=product_group_id,product_group_name", "name": "product_group_name", "value": "product_group_id"}, "options": [] },
                            { "field_name": "valid_from",   "type": "date",   "editable": true, "label": "Valid From", "tip": "Product Validity Start Date", "validate": "required" },
                            { "field_name": "valid_till",   "type": "date",   "editable": true, "label": "Valid Till", "tip": "Product Validity End Date", "validate": "required" },
                            { "field_name": "wf_id", "type": "lookup", "editable": true, "label": "Select Product Type", "tip": "Select Product Workflow", 
                                  "source": {"url":"/api/v1/wf?fields=wf_id,wf_name&wf_type=Policy", "name": "wf_name", "value": "wf_id"}, "options": [] },
                            { "field_name": "product_code", "type": "string", "label": "Product Code" },
                            { "field_name": "default_quote_validity", "type": "string", "label": "Default Quote Validty Period" },
                            { "field_name": "default_proposal_validity", "type": "string", "label": "Default Proposal Validty Period" },
                            { "field_name": "status",  "type": "lookup", "label": "Status", "options": [ {"name": "Active", "value": 0}, {"name": "Disabled", "value": 1}] },
                            { "field_name": "product_icon",   "type": "faicon",   "editable": true, "label": "Product Icon" }

                        ]
                    },
                    {
                        "name" : "Rating Excel",
                        "desc": "Premium Calculator/Proposal Form (XLSX)",
                        "fields": [
                            { "field_name": "quote_input_sheets",     "type": "string", "label": "Quotation Sheet numbers (comma)" },
                            { "field_name": "proposal_input_sheets",  "type": "string", "label": "Proposal Sheet numbers (comma)" },
                            { "field_name": "nstp_input_sheets",  "type": "string", "label": "NSTP (UW) Sheet numbers" },
                            { "field_name": "hidden_input_sheets",  "type": "string", "label": "Other Input Sheet numbers (comma)" ,"span":12},                             
                            { "field_name": "premium_calc",           "type": "file", "label": "Upload Premium Calculator (xlsx)", "args": "quote_input_sheets,proposal_input_sheets", "span": 4 },
                            { "field_name": "premium_calc_desc",      "type": "textbox", "label": "Premium calculation xlsx file, will be used by quotation and proposal stages", "span": 8 },
                            { "field_name": "quote_html",             "type": "file", "label": "Upload Printable Quote HTML(zip)", "span": 4, "url":"'/api/v1/product/attach/'+data.product_id+'/quote_html'","method":"post" },
                            { "field_name": "quote_lambda",           "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/quote_html'", "method": "post" },
                            { "field_name": "quote_lambda_test",      "type": "button", "label": "Test Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/quote_html'", "method": "download" },
                            { "field_name": "proposal_html",          "type": "file", "label": "Upload Proposal Template HTML(zip)", "span": 4 },
                            { "field_name": "proposal_lambda",        "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/proposal_html'", "method": "post" },
                            { "field_name": "proposal_lambda_test",   "type": "button", "label": "Test (Proposal) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/proposal_html'", "method": "download" },
                            { "field_name": "Axiscash_html",            "type": "file", "label": "Upload Axiscash Schedule HTML(zip)", "span": 4 },
                            { "field_name": "Axiscash_lambda",          "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/Axiscash_html'", "method": "post" },
                            { "field_name": "Axiscash_lambda_test",     "type": "button", "label": "Test (Axiscash) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/Axiscash_html'", "method": "download" },
                            { "field_name": "Axischeque_html",            "type": "file", "label": "Upload Axischeque Schedule HTML(zip)", "span": 4 },
                            { "field_name": "Axischeque_lambda",          "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/Axischeque_html'", "method": "post" },
                            { "field_name": "Axischeque_lambda_test",     "type": "button", "label": "Test (Axischeque) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/Axischeque_html'", "method": "download" },
                            { "field_name": "ICICIcash_html",            "type": "file", "label": "Upload ICICIcash Schedule HTML(zip)", "span": 4 },
                            { "field_name": "ICICIcash_lambda",          "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/ICICIcash_html'", "method": "post" },
                            { "field_name": "ICICIcash_lambda_test",     "type": "button", "label": "Test (ICICIcash) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/ICICIcash_html'", "method": "download" },
                            { "field_name": "ICICIcheque_html",            "type": "file", "label": "Upload ICICIcheque Schedule HTML(zip)", "span": 4 },
                            { "field_name": "ICICIcheque_lambda",          "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/ICICIcheque_html'", "method": "post" },
                            { "field_name": "ICICIcheque_lambda_test",     "type": "button", "label": "Test (ICICIcheque) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/ICICIcheque_html'", "method": "download" }, 
                            { "field_name": "policy_html",            "type": "file", "label": "Upload Policy Schedule HTML(zip)", "span": 4 },
                            { "field_name": "policy_lambda",          "type": "button", "label": "Publish to Lambda","span": 4, "url": "'/api/v1/products/pngin/'+data.product_id+'/policy_html'", "method": "post" },
                            { "field_name": "policy_lambda_test",     "type": "button", "label": "Test (Policy) Lambda","span": 4, "url": "'/api/v1/products/pngin/test/'+data.product_id+'/policy_html'", "method": "download" },
                            { "field_name": "covernote_html",         "type": "file", "label": "Upload Cover note HTML(zip)", "span": 12 },
                            { "field_name": "tax_invoice_html",       "type": "file", "label": "Upload Tax Invoice HTML(zip)", "span": 12 },                
                            { "field_name": "premium_value",          "type": "string", "label": "Premium Value Cell location or name" },
                            { "field_name": "other_outputs",          "type": "string", "label": "Other Named Outputs" },
                            { "field_name": "pdf_password",           "type": "string", "label": "PDF Password cell name" },
                            { "field_name": "compute_all_named_formula","type": "checkbox", "label": "Compute all Named (single) formula" },
                            { "field_name": "generate_form",          "type": "button", "click": "generateForms", "label": "Generate Forms"},
                            { "field_name": "preview_premium_calc",   "type": "button", "label": "Preview"},
                            { "field_name": "stop_on_json_errors",   "type": "checkbox", "label": "Stop on JSON errors" },
                            { "field_name": "display_errors",         "type": "checkbox", "label": "Display Excel errors" },
                            { "field_name": "quote2_html",            "type": "file", "label": "Upload Alternate Quote HTML(zip)" },                           
                            { "field_name": "quote_valid_cell",       "type": "string", "label": "Quotation validity cell name/id" },
                            { "field_name": "proposal_valid_cell",    "type": "string", "label": "Proposal validity cell name/id" },
                            { "field_name": "quote_premium_is_final", "type": "checkbox", "label": "Quotation premium is final" },
                            { "field_name": "xngin",                  "type": "string", "label": "Rating Engine Module name" }
                        ]
                    },
                    {
                        "name": "Publish",
                        "desc": "Publish product",
                        "fields": [
                            { "field_name": "publish_product",  "type": "productpublish", "label": "Verify and publish", "span": 12}
                        ]
                    },
                    {
                        "name": "Payments",
                        "desc": "Payment Options",
                        "fields": [
                            { "field_name": "allowed_payment_types",  "type": "checkboxmulti", "label": "Select allowed payment options", "span": 12,
                                "options": [ {"label": "Credit Card", "value": "Credit Card"}, {"label": "Cheque", "value": "Cheque"}, 
                                             {"label": "Cash", "value": "Cash"}, {"label": "Fund Transfer", "value": "Fund Transfer"}] },
                            { "field_name": "payment_installments",  "type": "checkbox", "label": "Allow payment in installments (recurring)", "options": [{"label": "Allow installments", "name": "payment_installments", "value": "Yes"}], "span": 6 },
                            { "field_name": "num_payment_terms",  "type": "number", "label": "Maximum number of payment terms", "if": "payment_installments=='Yes'", "span": 6 }

                        ]
                    },
                    {
                        "name": "Documents",
                        "desc": "Customer Documents",
                        "fields": [
                            { "field_name": "documents",  "type": "array", "label": "Attach documents", "span": 12, "field_desc": "Attachment Details",
                                "items": [
                                { "field_name": "document_description",  "type": "string", "label": "Attachement description"},
                                { "field_name": "document_type",  "type": "string", "label": "Type of the document (unique)" },
                                { "field_name": "document_mandatory", "type": "checkbox", "label": "Must Upload", "options" : [{"label": "Mandatory", "name": "document_mandatory", "value": "Yes", "span": 12} ] },
                                { "field_name": "mandatory_condition","type": "string", "label": "Mandatory Condition", "span": 8 },
                                { "field_name": "document_verify", "type": "checkbox", "label": "Verification Needed", "options" : [{"label": "Verification Needed", "name": "document_verify", "value": "Yes", "span": 12} ], "span": 4 }
                                ]
                            }

                        ]
                    },
                    {
                        "name": "Discounts",
                        "desc": "Discounts",
                        "fields": [
                            { "field_name": "discounts",  "type": "array", "label": "Discounts", "span": 12, "field_desc": "Discounts",
                                "items": [
                                { "field_name": "discount_name",  "type": "string", "label": "Dicousnt name"},
                                { "field_name": "discount_desc",  "type": "string", "label": "Dicousnt description"},
                                { "field_name": "discount_type",  "type": "lookup", "label": "Select Type of the discount", "options": ["Absolute", "Percentage"]},
                                { "field_name": "discount_value_from",  "type": "number", "label": "Discount minimum value", "default": "0"},
                                { "field_name": "discount_value_to",  "type": "number", "label": "Discount maximum value", "default": "0"}
                            ]
                            }
                        ]
                    },
                    {
                        "name": "Loadings",
                        "desc": "Loadings",
                        "fields": [
                            {   "field_name": "loadings",  "type": "array", "label": "Loadings", "span": 12, "field_desc": "Loading",
                                "items": [
                                    { "field_name": "loading_name",  "type": "string", "label": "Loading name"},
                                    { "field_name": "loading_desc",  "type": "string", "label": "Loading description"},
                                    { "field_name": "loading_type",  "type": "lookup", "label": "Select Type of the loading", "options": ["Absolute", "Percentage"]},
                                    { "field_name": "loading_value_from",  "type": "number", "label": "Loading minimum value", "default": "0"},
                                    { "field_name": "loading_value_to",  "type": "number", "label": "Loading maximum value", "default": "0"}
                                ]
                            }
                        ]
                    }

                ]
            }
        },
        {
            "name": "NSTP",
            "desc": "Set NSTP Properties",
            "icon": "fa-sitemap",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Quote NSTP",
                        "desc": "Quote Stage NSTP Configurations",
                        "fields": [
                            { "field_name": "qnstp_enabled","type": "checkbox", "label": "Enable NSTP (Quotation)", "options" : [{"label": "Enabled", "name": "qnstp_enabled", "value": "Yes"} ] },
                            { "field_name": "qnstp_flag",  "type": "string", "label": "NSTP Cell Name", "if": "qnstp_enabled=='Yes'"},
                            { "field_name": "qnstp_value", "type": "string", "label": "NSTP Cell Value to Match", "if": "qnstp_enabled=='Yes'"},
                            { "field_name": "qnstp_finalize_on_approval","type": "checkbox", "label": "Finalize Quote On Approval" },
                            { "field_name": "qnstp_auto_assign","type": "checkbox", "label": "Automatically assign to users if possible" }
                        ]
                    },
                    {
                        "name" : "Proposl NSTP",
                        "desc": "Proposal Stage NSTP Configurations",
                        "fields": [
                            { "field_name": "pnstp_enabled","type": "checkbox", "label": "Enable NSTP (Proposal)" },
                            { "field_name": "pnstp_flag",  "type": "string", "label": "NSTP Cell Name", "if": "pnstp_enabled=='Yes'"},
                            { "field_name": "pnstp_value", "type": "string", "label": "NSTP Cell Value to Match", "if": "pnstp_enabled=='Yes'"},
                            { "field_name": "pnstp_finalize_on_approval","type": "checkbox", "label": "Finalize Proposal On Approval", "if": "pnstp_enabled=='Yes'" },
                            { "field_name": "pnstp_auto_assign","type": "checkbox", "label": "Automatically assign to users if possible" }
                        ]
                    },
                    {
                        "name" : "NSTP",
                        "desc": "NSTP Configurations",
                        "fields": [
                            { "field_name": "nstp_enabled","type": "checkbox", "label": "Enable NSTP", "options" : [{"label": "Enabled", "name": "nstp_enabled", "value": "Yes"} ] },
                            { "field_name": "nstp_flag",  "type": "string", "label": "NSTP Cell Name", "if": "nstp_enabled=='Yes'"},
                            { "field_name": "nstp_value", "type": "string", "label": "NSTP Cell Value to Match", "if": "nstp_enabled=='Yes'"},
                            { "field_name": "nstp_auto_assign","type": "checkbox", "label": "Automatically assign to users if possible" }
                        ]
                    }

                ]
            }
        },
        {
            "name": "Renewals",
            "desc": "Renewal Properties",
            "icon": "fa-sitemap",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Renewal-General",
                        "desc": "General",
                        "fields": [
                            { "field_name": "renewal_wf_id", "type": "lookup", "editable": true, "label": "Renewal Workflow", "tip": "Select Renewal workflow", 
                                "source": {"url":"'/api/v1/wf?fields=wf_id,wf_name&wf_type=Policy'", "name": "wf_name", "value": "wf_id"}, "options": [] },
                            { "field_name": "renewal_notice_html",     "type": "file", "label": "Upload Notice Template HTML(zip)" },
                            { "field_name": "renewal_token_expiry",    "type": "string", "label": "Token expiry days (after policy expiry)" },
                            { "field_name": "renewal_link_password_field",    "type": "string", "label": "Link password field" },
                            { "field_name": "renewal_readonly_cells",  "type": "text", "label": "Readonly cells (Comma separated)", "span": 12 }
                        ]
                    },
                    {
                        "name" : "Renewal-Inspection",
                        "desc": "Inspection",
                        "fields": [
                            { "field_name": "insp_flag",  "type": "string", "label": "Inspection Cell Name"},
                            { "field_name": "insp_value", "type": "string", "label": "Inspection Cell Value to Match"},
                            { "field_name": "need_insp_accept","type": "checkbox", "label": "Underwriter Acceptance needed", "span": 6,
                                "options" : [{"label": "Need Underwriter Acceptance", "name": "need_insp_accept", "value": "Yes"} ] }
                        ]
                    },
                    {
                        "name": "Documents",
                        "desc": "Inspection Documents",
                        "fields": [
                            { "field_name": "renewal_documents",  "type": "array", "label": "Attach documents", "span": 12, "field_desc": "Attachment Details",
                                "items": [
                                { "field_name": "document_description",  "type": "string", "label": "Attachement description"},
                                { "field_name": "document_type",  "type": "string", "label": "Type of the document (unique)" },
                                { "field_name": "documents_allowed","type": "select", "label": "Select List of allowed document types", "multiple": true, "options": [],
                                    "source": {"url":"'/api/v1/master?fields=name,value&group_name=customer_documents&group_name_1='+this.iobject.document_type", "name": "name", "value": "value"} },
                                { "field_name": "document_count",  "type": "lookup", "label": "Select Document Count", "options": ["Any One Of", "All", "Any Two"]},
                                { "field_name": "document_max_size",  "type": "number", "label": "Maximum file size (KBytes)", "default": "300"},
                                { "field_name": "document_mandatory", "type": "checkbox", "label": "Must Upload", "options" : [{"label": "Yes", "name": "nstp_enabled", "value": "Yes"} ] }
                            ]
                            }

                        ]
                    }

                ]
            }
        },
        {
            "name": "Access Control",
            "desc": "Set Product Access Privileges",
            "icon": "fa-lock",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Quote Privilege",
                        "desc": "Quote Privilege",
                        "fields": [
                            { "field_name": "setgroups",  "type": "groups", "label": "Enable Access To", "span": 12 }
                        ]
                    },
                    {
                        "name" : "Sheet Privilege",
                        "desc": "Sheet Privilege",
                        "fields": [
                            { "field_name": "sheetprivilege",  "type": "sheetprivilege", "label": "Enable Write To", "span": 12 }
                        ]
                    },
                    {
                        "name" : "Field Privilege",
                        "desc": "Field Privilege",
                        "fields": [
                            { "field_name": "fieldprivilege",  "type": "fieldprivilege", "label": "Field Level Privilege", "span": 12 }
                        ]
                    },
                    {
                        "name" : "Ownership",
                        "desc": "Modify Ownership",
                        "fields": [
                            { "field_name": "newEntity",  "type": "user", "label": "Change ownership to", "span": 4 },
                            { "field_name": "changeOwner",  "type": "button", "label": "Change Owner", "span": 4, "url": "'/api/v1/products/claim/'+product_id+'/'+newEntity", "method": "POST" }
                        ]
                    }

                ]
            }
        },
        {
            "name": "Catalog",
            "desc": "Product Information Catalog",
            "icon": "fa-file",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Brochure",
                        "desc": "List of Files/Images",
                        "fields": [
                            { "field_name": "front_cover",  "type": "file", "label": "Front Cover", "file_type": "catalog", "span": "3", "source": {"url":"'/api/v1/products/data/'+this.mod.product_id+'/catalog/'+this.field.cur_file.file_name+'?download=1'"} },
                            { "field_name": "back_cover",  "type": "file", "label": "Back Cover", "file_type": "catalog", "span": "3" },
                            { "field_name": "tac",  "type": "file", "label": "Terms And Conditions", "file_type": "catalog", "span": "3" }
                        ]
                    }
                ]
            }
        },
        {
            "name": "Custom Fields",
            "desc": "Custom Field Mapping",
            "icon": "fa-columns",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Custom Fields",
                        "desc": "Custom Field Mapping",
                        "fields": [
                            { "field_name": "cust_fld_1",         "type": "string", "label": "Fld 1 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_1_disp",    "type": "string", "label": "Fld 1 Display Name", "span": "3" },
                            
                            { "field_name": "cust_fld_2",         "type": "string", "label": "Fld 2 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_2_disp",    "type": "string", "label": "Fld 2 Display Name", "span": "3" },

                            { "field_name": "cust_fld_3",         "type": "string", "label": "Fld 3 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_3_disp",    "type": "string", "label": "Fld 3 Display Name", "span": "3" },

                            { "field_name": "cust_fld_4",         "type": "string", "label": "Fld 4 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_4_disp",    "type": "string", "label": "Fld 4 Display Name", "span": "3" },

                            { "field_name": "cust_fld_5",         "type": "string", "label": "Fld 5 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_5_disp",    "type": "string", "label": "Fld 5 Display Name", "span": "3" },

                            { "field_name": "cust_fld_6",         "type": "string", "label": "Fld 6 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_6_disp",    "type": "string", "label": "Fld 6 Display Name", "span": "3" },

                            { "field_name": "cust_fld_7",         "type": "string", "label": "Fld 7 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_7_disp",    "type": "string", "label": "Fld 7 Display Name", "span": "3" },
                            
                            { "field_name": "cust_fld_8",         "type": "string", "label": "Fld 8 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_8_disp",    "type": "string", "label": "Fld 8 Display Name", "span": "3" },

                            { "field_name": "cust_fld_9",         "type": "string", "label": "Fld 9 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_9_disp",    "type": "string", "label": "Fld 9 Display Name", "span": "3" },

                            { "field_name": "cust_fld_10",        "type": "string", "label": "Fld 10 Cell ID/Name", "span": "3" },
                            { "field_name": "cust_fld_10_disp",   "type": "string", "label": "Fld 10 Display Name", "span": "3" },


                            { "field_name": "fix_custom_fields", "type": "button", "label": "Fix Past Quotes/Policies", "desc": "Fix Past Quotes/Policies", "span": 3, "url": "'/api/v1/auth/fix/custom_fields/'+product_id", "method":"psot" }
                        ]
                    }
                ]
            }
        },
        {
            "name": "Master Policy",
            "desc": "Master policy management",
            "icon": "fa-cubes",
            "module": {
                "name" : "product",
                "url"  : "/api/v1/products",
                "id"   : "product_id"
            },
            "form":{
                "groups": [
                    {
                        "name" : "Open cover",
                        "desc": "Open cover policy setup",
                        "fields": [
                            { "field_name": "master_policy_enabled","type": "checkbox", "label": "Make this master policy product", "options" : [{"label": "Enabled", "name": "master_policy_enabled", "value": "Yes"} ] },
                            { "field_name": "limit_property",  "type": "string", "label": "Limit property cell name", "if": "master_policy_enabled=='Yes'"},
                            { "field_name": "coi_product_id",  "type": "lookup", "label": "Select COI Product", "if": "master_policy_enabled=='Yes'",
                                "source": {"url":"'/api/v1/products'", "name": "product_name", "value": "product_id"}
                            },
                            { "field_name": "fields_to_coi",  "type": "string", "label": "Send to COI (comma separated)", "if": "master_policy_enabled=='Yes'"}
                        ]
                    },
                    {
                        "name" : "Configurable Parameters",
                        "desc": "Configurable Parameters",
                        "fields": [
                            { "field_name": "num_parameters",  "type": "array", "label": "Number parameter", "span": 12, "field_desc": "Number parameters",
                                "items": [
                                    { "field_name": "param_name",  "type": "lookup", "label": "Parameter name", "options": "coiParams",  "source": {}, "default": "" },
                                    { "field_name": "param_desc",  "type": "string", "label": "Display name"}
                                ]
                            },

                            { "field_name": "range_parameters",  "type": "array", "label": "Range parameter", "span": 12, "field_desc": "Range parameters",
                                "items": [
                                    { "field_name": "param_name",  "type": "lookup", "label": "Parameter name", "options": "coiParams",  "source": {}, "default": "" },
                                    { "field_name": "param_desc",  "type": "string", "label": "Display name"}
                                ]
                            },

                            { "field_name": "list_parameters",  "type": "array", "label": "Option parameter", "span": 12, "field_desc": "List (options) parameters",
                                "items": [
                                    { "field_name": "param_name",  "type": "lookup", "label": "Parameter name", "options": "coiLists",  "source": {}, "default": "" },
                                    { "field_name": "param_desc",  "type": "string", "label": "Display name"},
                                    { "field_name": "param_options",  "type": "string", "label": "Additional Options (~ separated"}
                                ]
                            },

                            { "field_name": "rate_parameters",  "type": "array", "label": "Rate parameter", "span": 12, "field_desc": "Rate parameters",
                                "items": [
                                    { "field_name": "param_name",  "type": "lookup", "label": "Parameter name", "options": "coiRates",  "source": {}, "default": "" },
                                    { "field_name": "param_desc",  "type": "string", "label": "Display name"}
                                ]
                            }

                        ]
                    },
                    {
                        "name" : "COI Setup",
                        "desc": "COI Setup",
                        "fields": [
                            { "field_name": "master_policy_product_id","type": "lookup", "label": "Make this COI product", "options" : "masterProductList" }
                        ]
                    }

                ]
            }
        },
        {
            "name": "Rules",
            "desc": "Configurations",
            "icon": "fa-file",
            "form":{
                "groups": [
                    {
                        "name" : "Rules",
                        "desc": "Configurations",
                        "fields": [
                            { "field_name": "rulechains",  "type": "rulechains", "label": "Rule chains", "span": "12" }
                        ]
                    }
                ]
            }
        },
        {
            "name": "Files",
            "desc": "Files of this Product",
            "icon": "fa-file",
            "form":{
                "groups": [
                    {
                        "name" : "Files",
                        "desc": "Files",
                        "fields": [
                            { "field_name": "files",  "type": "table", "label": "Uploaded/Generated files", "url" : "/api/v1/products/file_names/{{product_id}}", "options": { "bAutoWidth" : false}, "links": ["data_id", "file_name"], "span": "12" }
                        ]
                    }
                ]
            }
        }
    ],
    "triggers": {
        "preview_premium_calc": "function(){ window.location.href='/admin/preview.html?product_id='+this.mod.product_id;",
        "coiParams": "function(field){var params = this.$parent.$parent.$parent.coi_params;if( params instanceof Array )return params.map(function(x){return x.name});return [];}",
        "coiLists": "function(field){return Object.keys(this.$parent.$parent.$parent.coi_product.premium_calc.lists) || [];}",
        "coiRates": "function(field){return Object.keys(this.$parent.$parent.$parent.coi_product.premium_calc.meta.rates) || [];}",
        "masterProductList": "function(field){var options = [];for(var i in profile.products){if( profile.products[i].data.master_policy_enabled == 'Yes')options.push({name: profile.products[i].product_name, value: profile.products[i].product_id});}return options;}"
    }
  }
  form:any;
  constructor(public productService:ProductService,public fb:FormBuilder,public global:GlobalService){
    this.changeStage(0);
    this.currentmodule = this.workflow?.stages[0]?.module?.name;
    this.form = productService.dynamicForm1(this.workflow,this.currentmodule,this.global.product.data?this.global.product.data:this.global.product);
    console.log("global=>",this.global.product);
  }
  get formcontrols(){
    return this.form.controls;
  }
  changeStage(value:number){
    if(this.activestage!=value || this.currentflow==""){
      this.activestage = value;
      this.activeflow = 0;
      this.currentstage = this.workflow.stages[value];
      this.flowname = this.workflow.stages[value]["form"]["groups"][this.activeflow]["name"];
      this.currentflow = this.workflow.stages[value]["form"]["groups"][this.activeflow];
      this.premodule = this.currentmodule;
      this.currentmodule = this.workflow?.stages[value]?.module?.name;
      if(this.premodule!=this.currentmodule){
        this.form = this.productService.dynamicForm1(this.workflow,this.currentmodule,this.global.product.data?this.global.product.data:this.global.product);
      }
      this.fetchlookup();
    }
  }
  changeflow(index1:number,index2:number){
    this.currentstage = this.workflow.stages[index1];
    this.flowname = this.workflow.stages[index1]["form"]["groups"][index2]["name"];

    this.currentflow = this.workflow.stages[index1]["form"]["groups"][index2];
    this.activeflow = index2;
    this.fetchlookup();
  }
  fetchlookup(){
    for(let field of this.currentflow.fields){
        if(field.source){
            field.options.length = 0;
            this.productService.fetchsource(field.source.url,field);
        }
    }
  }
  iconclick(){
    this.icontable = true;
  }
  changeIcon(iconclass:string){
    this.faicon = iconclass;
    this.icontable = false;
  }
  submit(){
    console.log(this.form.value);
    const url = environment.Url+this.currentstage.module.url;
    console.log(url);
    const headers = this.productService.service.creatHeader();
    const request = this.form.value;
    console.log(request);
    this.productService.service.postAPICall(url,request,headers).subscribe({
        next:(response)=>{
            data = {...data,...response[0]};
            this.global.product = {...this.global.product,...response[0]};
        },
        error:(err)=>{
            console.log(err);
            console.log("error is error not handled by others");
        },
        complete:()=>{
            console.log("process has been completed");
        }
    })
  }
  ngOnInit(): void {
    console.log(this.arr1);
  }
  ngAfterViewInit():void{
    console.log(this.arr1);
  }
  ngOnDestroy():void{
    console.log(this.arr1);
  }
}
