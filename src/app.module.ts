import { MediaController } from "./media/media.controller";
import { MediaService } from "./media/media.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [MediaController],
  providers: [MediaService],
})
export class AppModule {}
