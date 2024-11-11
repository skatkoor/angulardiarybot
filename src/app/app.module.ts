// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { DiaryModule } from './features/diary/diary.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthWrapperComponent } from './components/auth/auth-wrapper/auth-wrapper.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MarkdownPipe } from './pipes/markdown.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AuthWrapperComponent,
    MarkdownPipe,
    // Add other components, pipes, directives here
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    DiaryModule,
    HttpClientModule,
    FormsModule,
    // Add other modules here
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    // Add other providers here
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
