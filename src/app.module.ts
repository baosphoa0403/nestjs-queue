import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { AudioConsumer } from 'src/audio.consumer';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'audio',
      prefix: 'bull-queue',
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: false,
        backoff: {
          type: 'fixed',
          delay: 1000,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AudioConsumer],
})
export class AppModule {}
