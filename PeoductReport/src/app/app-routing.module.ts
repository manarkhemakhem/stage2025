import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitsComponent } from './produits/produits.component';
import { CreateproductComponent } from './createproduct/createproduct.component';
import { EditproductComponent } from './editproduct/editproduct.component';


const routes: Routes = [
  { path: 'produits', component: ProduitsComponent },  // Affichage de la liste des produits
  { path: '', redirectTo: '/produits', pathMatch: 'full' },
  { path: 'create', component: CreateproductComponent },
  { path: 'edit/:id', component: EditproductComponent } // Activation de l'édition avec un paramètre ID

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
