import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { RouterModule } from '@angular/router';

import { NgIconsModule } from '@ng-icons/core';
import {
  heroBookOpenSolid,
  heroClipboardDocumentListSolid,
  heroCurrencyDollarSolid,
  heroCog6ToothSolid,
  heroChevronLeftSolid,
  heroChevronRightSolid,
  heroPencilSquareSolid,
  heroTrashSolid,
  heroClipboardDocumentSolid,
} from '@ng-icons/heroicons/solid';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgIconsModule.withIcons({
      heroBookOpenSolid,
      heroClipboardDocumentListSolid,
      heroCurrencyDollarSolid,
      heroCog6ToothSolid,
      heroChevronLeftSolid,
      heroChevronRightSolid,
      heroPencilSquareSolid,
      heroTrashSolid,
      heroClipboardDocumentSolid,
    }),
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
  ],
})
export class SharedModule {}
