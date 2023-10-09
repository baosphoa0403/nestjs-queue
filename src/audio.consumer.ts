import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueWaiting,
  OnQueueStalled,
  OnQueueFailed,
  OnQueueRemoved,
} from '@nestjs/bull';
import { BadGatewayException } from '@nestjs/common';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {
  @Process({ concurrency: 1 })
  async transcode(job: Job<unknown>) {
    console.log('zo consumer');
    // console.log('before' + JSON.stringify(job.data));
    if (job.data['index'] % 2 !== 0) {
      throw new BadGatewayException('Job failed');
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`[ON_ACTIVE]-[JOB_ID: ${job.id} - JOB_NAME: ${job.name}]`);
    // [DATA: ${JSON.stringify(job.data)}]
  }

  @OnQueueWaiting()
  onWaiting(jobId: number | string) {
    console.log(`[ON_WAITING]-[JOB_ID: ${jobId}]`);
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    console.log(`[ON_STALLED]-[JOB_ID: ${job.id} - JOB_NAME: ${job.name}]`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(
      `[ON_FAILED]-[JOB_ID: ${job.id} - JOB_NAME: ${
        job.name
      }]-[DATA: ${JSON.stringify(job.data)}] - [ERROR: ${JSON.stringify(err)}]`,
    );
  }

  @OnQueueRemoved()
  onRemoved(job: Job) {
    console.log(`[ON_REMOVED]-[JOB_ID: ${job.id} - JOB_NAME: ${job.name}]`);
  }
}
