import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuggyModule } from './buggy.module';
import { BuggyController } from './buggy.controller';

@Module({
  imports: [BuggyModule],
  controllers: [AppController, BuggyController],
  providers: [AppService],
})
export class AppModule {}
