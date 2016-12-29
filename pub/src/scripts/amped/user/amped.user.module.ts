import { MaterialModule }     from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';


import { AmpedService } from '../common/amped.common.service';
import { AmpedCrudModule } from '../crud/amped.crud.module';
import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedFilesModule } from '../files/amped.files.module';

import { AmpedUserThumb } from './amped.user.thumb.component';
import { AmpUserCard } from './amped.user.card';
import { UserProfileComponent } from './pages/amped.user.profile.component';

@NgModule({
  imports         : [ CommonModule, FormsModule, ReactiveFormsModule, MaterialModule.forRoot(), AmpedCommonModule, AmpedFilesModule, AmpedCrudModule ],
  declarations    : [ AmpedUserThumb, AmpUserCard, UserProfileComponent ],
  exports         : [ AmpedUserThumb, AmpUserCard, UserProfileComponent ],
  providers       : [ AmpedService ],
  entryComponents : [  ]
})
export class AmpedUserModule {}
