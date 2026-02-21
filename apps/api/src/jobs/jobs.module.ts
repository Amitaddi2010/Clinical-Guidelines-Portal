import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TranslationProcessor } from './translation.processor';
import { EmailProcessor } from './email.processor';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'translation',
        }),
        BullModule.registerQueue({
            name: 'email',
        }),
    ],
    providers: [TranslationProcessor, EmailProcessor],
    exports: [BullModule],
})
export class JobsModule { }
