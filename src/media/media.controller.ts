import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { MediaService } from "./media.service";
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nest-lab/fastify-multer";
import { MediaResponse } from "./dto/media.response.dto";

@ApiTags("media")
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    required: true,
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiOkResponse({
    type: MediaResponse,
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 350_000_000,
            message: "File size exceeds the maximum limit of 350MB.",
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    await this.mediaService.upload(file);

    return {
      status: "success",
      filename: file.filename,
    };
  }
}
