import { Module } from '@nestjs/common';
import { BuggyService } from './buggy-service';

@Module({
  providers: [BuggyService],
  exports: [BuggyService],
})
export class BuggyModule {}
