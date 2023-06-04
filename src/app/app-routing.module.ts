import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { ViewPersonComponent } from './component/dashboard/view-person/view-person.component';
import { AddPersonComponent } from './component/dashboard/add-person/add-person.component';
import { EditPersonComponent } from './component/dashboard/edit-person/edit-person.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create', component: AddPersonComponent },
  { path: 'read/:personId', component: ViewPersonComponent },
  { path: 'update/:personId', component: EditPersonComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
