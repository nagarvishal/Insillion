import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './user-management/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PagenotfoundComponent } from './user-management/pagenotfound/pagenotfound.component';
import { UsermanagementComponent } from './user-management/usermanagement/usermanagement.component';
import { HeaderComponent } from './user-management/header/header.component';
import { FooterComponent } from './user-management/footer/footer.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupsComponent } from './user-management/root-component/groups/groups.component';
import { UsersComponent } from './user-management/root-component/users/users.component';
import { RolesComponent } from './user-management/root-component/roles/roles.component';
import { PrevillegesComponent } from './user-management/root-component/previlleges/previlleges.component';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { MessageService } from 'primeng/api';
import { ChangeBooleanPipe,Capitalisation } from './user-management/pipes/change-boolean.pipe';
import { ManagePluginsComponent } from './plugins/manage-plugins/manage-plugins.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { ManagePluginFilesComponent } from './plugins/manage-plugin-files/manage-plugin-files.component';
import { BrokerComponent } from './user-management/root-component/broker/broker.component';
import { ProductLobComponent } from './product-management/product-lob/product-lob.component';
import { WflowEditComponent } from './product-management/wflow-edit/wflow-edit.component';
import { MasterComponent } from './plugins/master/master.component';
import { ImportMasterComponent } from './plugins/import-master/import-master.component';
import { ProductComponent } from './product-management/product/product.component';
import { HomeComponent } from './product-management/home/home.component';
import { ProductListComponent } from './product-management/product-list/product-list.component';
const DEFAULT_ACE_CONFIG: AceConfigInterface = {
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PagenotfoundComponent,
    UsermanagementComponent,
    HeaderComponent,
    FooterComponent,
    GroupsComponent,
    UsersComponent,
    RolesComponent,
    PrevillegesComponent,
    ChangeBooleanPipe,
    Capitalisation,
    ManagePluginsComponent,
    ManagePluginFilesComponent,
    BrokerComponent,
    ProductLobComponent,
    WflowEditComponent,
    MasterComponent,
    ImportMasterComponent,
    ProductComponent,
    HomeComponent,
    ProductListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbDropdownModule,
    BrowserAnimationsModule,
    ToastModule,
    MonacoEditorModule.forRoot(),
    AceModule
  ],
  providers: [
    {
      provide: ACE_CONFIG,
      useValue: DEFAULT_ACE_CONFIG
    },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
