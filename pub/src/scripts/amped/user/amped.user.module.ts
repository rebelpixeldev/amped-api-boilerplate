import { MaterialModule }     from '@angular/material';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';


import { AmpedService } from '../common/amped.common.service';
import { AmpedCrudModule } from '../crud/amped.crud.module';
import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedFilesModule } from '../files/amped.files.module';
import { AmpedFormsModule } from '../form/amped.form.module';

import { AmpedUserThumb } from './amped.user.thumb.component';
import { AmpUserCard } from './amped.user.card';
import { UserProfileComponent } from './pages/amped.user.profile.component';
import { AccountUsersComponent } from './pages/amped.account.users.component';

import { InviteUserDialog, InviteUserDialogDirective }      from './dialogs/amped.user.invite.dialog';


@NgModule({
  imports         : [ CommonModule, FormsModule, ReactiveFormsModule, MaterialModule.forRoot(), AmpedCommonModule, AmpedFilesModule, AmpedCrudModule, AmpedFormsModule ],
  declarations    : [ AmpedUserThumb, AmpUserCard, UserProfileComponent, AccountUsersComponent, InviteUserDialog, InviteUserDialogDirective ],
  exports         : [ AmpedUserThumb, AmpUserCard, UserProfileComponent, AccountUsersComponent, InviteUserDialog, InviteUserDialogDirective ],
  providers       : [ AmpedService ],
  entryComponents : [ InviteUserDialog ]
})
export class AmpedUserModule {}
