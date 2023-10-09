import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}

  generateRandomArray(length: number): number[] {
    const randomArray = [];

    for (let i = 0; i < length; i++) {
      const randomNumber = Math.floor(Math.random() * 1000); // Generate random integer between 0 and 999
      randomArray.push(randomNumber);
    }

    return randomArray;
  }
  async getHello(): Promise<string> {
    // for (let index = 0; index < 10; index++) {
    //   await this.audioQueue.add(
    //     {
    //       foo: 'priority ' + index,
    //       index,
    //     },
    //     {
    //       attempts: 3,
    //       backoff: {
    //         delay: 1000,
    //         type: 'exponential',
    //       },
    //       removeOnComplete: true,
    //       removeOnFail: false,
    //     },
    //   );
    // }

    // add job bulk

    const array = this.generateRandomArray(10).sort((a, b) => a - b);
    await this.audioQueue.addBulk(
      array.map((item) => {
        return {
          data: {
            index: item,
          },
          opts: { removeOnComplete: true },
        };
      }),
    );

    return 'add job';
  }
}
