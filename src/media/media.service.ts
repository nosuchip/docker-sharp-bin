import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import crypto from "crypto";
import path from "path";
import sharp from "sharp";

@Injectable()
export class MediaService {
  constructor() {}

  async upload(file: Express.Multer.File): Promise<void> {
    const ext = path.extname(file.originalname)?.replace(".", "").toLowerCase();
    const safeFilename = crypto.randomUUID();

    const outPath = "/outfiles";

    let failed = false;

    if (["heic", "heif"].includes(ext)) {
      await sharp(file.buffer)
        .resize(400, 400)
        .toFormat("jpeg")
        .toFile(`${outPath}/${safeFilename}.jpg`);
    } else {
      throw new UnprocessableEntityException(
        "Media content safety check failed"
      );
    }
  }
}
