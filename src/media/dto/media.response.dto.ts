import { ApiProperty } from "@nestjs/swagger";

export class MediaResponse {
  @ApiProperty()
  status: string;
}
