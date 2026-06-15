import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { WeatherComponent } from './pages/weather/weather.component';
import { ClothingComponent } from './pages/clothing/clothing.component';
import { MeetingComponent } from './pages/meeting/meeting.component';
import { MealsComponent } from './pages/meals/meals.component';
import { TrainingComponent } from './pages/training/training.component';
import { SuppliesComponent } from './pages/supplies/supplies.component';
import { ManualComponent } from './pages/manual/manual.component';
import { MediaComponent } from './pages/media/media.component';
import { DutyComponent } from './pages/duty/duty.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { PersonnelComponent } from './pages/personnel/personnel.component';
import { UsersComponent } from './pages/users/users.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { PageLayoutComponent } from './components/page-layout/page-layout.component';
import { FirstLoginModalComponent } from './components/first-login-modal/first-login-modal.component';

import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PageLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'weather', component: WeatherComponent },
      { path: 'clothing', component: ClothingComponent },
      { path: 'meeting', component: MeetingComponent },
      { path: 'meals', component: MealsComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'supplies', component: SuppliesComponent },
      { path: 'manual', component: ManualComponent },
      { path: 'media', component: MediaComponent },
      { path: 'duty', component: DutyComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'personnel', component: PersonnelComponent },
      { path: 'users', component: UsersComponent }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    WeatherComponent,
    ClothingComponent,
    MeetingComponent,
    MealsComponent,
    TrainingComponent,
    SuppliesComponent,
    ManualComponent,
    MediaComponent,
    DutyComponent,
    VehiclesComponent,
    PersonnelComponent,
    UsersComponent,
    SidebarComponent,
    HeaderComponent,
    PageLayoutComponent,
    FirstLoginModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { useHash: false })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
