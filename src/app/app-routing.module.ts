import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './user-management/login/login.component';
import { PagenotfoundComponent } from './user-management/pagenotfound/pagenotfound.component';
import { UsermanagementComponent } from './user-management/usermanagement/usermanagement.component';
import { HeaderComponent } from './user-management/header/header.component';
import { UsersComponent } from './user-management/root-component/users/users.component';
import { GroupsComponent } from './user-management/root-component/groups/groups.component';
import { RolesComponent } from './user-management/root-component/roles/roles.component';
import { PrevillegesComponent } from './user-management/root-component/previlleges/previlleges.component';
import { FooterComponent } from './user-management/footer/footer.component';
import { ManagePluginsComponent } from './plugins/manage-plugins/manage-plugins.component';
import { ManagePluginFilesComponent } from './plugins/manage-plugin-files/manage-plugin-files.component';
import { BrokerComponent } from './user-management/root-component/broker/broker.component';
import { ProductLobComponent } from './product-management/product-lob/product-lob.component';
import { WflowEditComponent } from './product-management/wflow-edit/wflow-edit.component';
import { MasterComponent } from './plugins/master/master.component';
import { ImportMasterComponent } from './plugins/import-master/import-master.component';
import { ProductComponent } from './product-management/product/product.component';
import { HomeComponent } from './product-management/home/home.component';
import { ProductListComponent } from './product-management/product-list/product-list.component';

const routes:Routes = [
  {path:'',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'header',component:HeaderComponent},
  {path:'footer',component:FooterComponent},
  {path:'admin-management/users',component:UsersComponent},
  {path:'admin-management/groups',component:GroupsComponent},
  {path:'admin-management/roles',component:RolesComponent},
  {path:'admin-management/broker',component:BrokerComponent},
  {path:'admin-management/previleges',component:PrevillegesComponent},
  {path:'plugin-management/plugins',component:ManagePluginsComponent},
  {path:'plugin-management/plugin-file',component:ManagePluginFilesComponent},
  {path:'product-management/product-lob',component:ProductLobComponent},
  {path:'product-management/wflow-edit',component:WflowEditComponent},
  {path:'product-management/product',component:ProductComponent},
  {path:'master-management/master',component:MasterComponent},
  {path:'master-management/import-master',component:ImportMasterComponent},
  {path:'product-management/products',component:ProductListComponent},
  {path:'**',component:PagenotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
