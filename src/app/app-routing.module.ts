import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { GameComponent } from './game/game.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: SettingsComponent },
  { path: 'game', component: GameComponent },
  { path: 'create', component: CreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
