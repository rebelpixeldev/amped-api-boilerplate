import { MaterialModule }     from '@angular/material';
import { NgModule }             from "@angular/core";
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AmpedCommonModule } from '../common/amped.common.module';

import { AmpConversationsComponent } from './amped.chat.conversations';
import { AmpedChatWindowComponent } from './amped.chat.window';
import { ChatMessageComponent } from './amped.chat.message';

import { AmpedChatService } from './amped.chat.service';

const exportDeclarations : Array<any> = [
  AmpConversationsComponent, AmpedChatWindowComponent, ChatMessageComponent
];

@NgModule({
  imports         : [ MaterialModule.forRoot(), AmpedCommonModule, BrowserModule, FormsModule ],
  declarations    : exportDeclarations,
  exports         : exportDeclarations,
  providers       : [ AmpedChatService ],
  entryComponents : [  ]
})
export class AmpedChatModule {}
