import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { createHash } from 'crypto';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {}

  /*
  Input: None
  Output: An instance of Storage
  Return value: Storage object
  Function: Creates an instance of Storage to interact with the Google Cloud Storage service
  Variables: projectId, keyFilename, bucketName
  Date: 14 - 08 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async getBucket() {
    const bucket = new Storage({
      projectId: 'intrepid-abacus-360419',
      keyFilename: process.env.GOOGLE_DRIVE_CREDENTIALS
    }).bucket(process.env.ASSETS_PATH);
    return bucket;
  }

  /*
  Input: file: Express.Multer.File
  Output: Promise<Image>
  Return value: Created or found image object
  Function: Creates a new image, saves file to disk, or returns existing image if hash matches
  Variables: uuid, extension, hasher, image, imageInDb, bucket
  Date: 14 - 08 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(file: Express.Multer.File) {
    const uuid = uuidv4();
    const extension = file.originalname.split('.').pop();
    const hasher = createHash('md5');
    const image = this.imageRepository.create({
      assetName: uuid + '.' + extension,
      hash: hasher.update(file.buffer).digest('hex').toString(),
      size: file.size,
      mimeType: file.mimetype
    });
    const imageInDb = await this.imageRepository.findOneBy({
      hash: image.hash
    });
    // If the image does not exist in the database, save it to disk and return the saved image
    if (!imageInDb) {
      fs.writeFile(
        process.cwd() + '/publicAssets/' + image.assetName,
        file.buffer,
        err => {
          if (err) {
            throw err;
          }
        }
      );
      const bucket = await this.getBucket();
      const res = await bucket.upload(
        `${process.cwd()}/publicAssets/${image.assetName}`,
        { destination: image.assetName }
      );
      if (res[0].metadata) {
        fs.rm(
          `${process.cwd()}/publicAssets/${image.assetName}`,
          { recursive: true },
          err => {
            if (err) {
              throw err;
            }
          }
        );
      }
      return await this.imageRepository.save(image);
    } else {
      return imageInDb;
    }
  }

  /*
  Input: None
  Output: Promise<Image[]>
  Return value: Array of all images
  Function: Retrieves all images
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.imageRepository.find();
  }

  /*
  Input: id: string
  Output: Promise<string>
  Return value: File
  Function: Finds an image by id and returns the image data from the cloud
  Variables: image, file, bucket
  Date: 14 - 08 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const image = await this.imageRepository.findOneBy({ id: id });
    if (image == null) {
      throw new NotFoundException('Imagen no encontrada.');
    }
    const bucket = await this.getBucket();
    const file = await bucket.file(image.assetName).get();
    return {
      mimeType: image.mimeType,
      name: image.assetName,
      data: file[0].createReadStream()
    };
  }

  /*
  Input: id: string, updateImageDto: Express.Multer.File
  Output: Promise<Image>
  Return value: Updated image object
  Function: Updates an image by id in the cloud storage
  Variables: image, file, bucket
  Date: 14 - 08 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateImageDto: Express.Multer.File) {
    const image = await this.imageRepository.findOneBy({ id: id });
    const hasher = createHash('md5');
    const bucket = await this.getBucket();
    const file = bucket.file(image.assetName);
    const updated = await file.save(updateImageDto.buffer, {
      metadata: {
        contentType: updateImageDto.mimetype
      }
    });
    return await this.imageRepository.save({
      id: id,
      hash: hasher.update(updateImageDto.buffer).digest('hex').toString(),
      mimeType: updateImageDto.mimetype,
      size: updateImageDto.size
    });
  }

  /*
  Input: id: string
  Output: Promise<Image>
  Return value: Removed image object
  Function: Removes an image by id from the cloud storage
  Variables: image, file, bucket
  Date: 14 - 08 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const image = await this.imageRepository.findOneBy({ id: id });
    const bucket = await this.getBucket();
    const file = bucket.file(image.assetName);
    const removed = await file.delete();
    console.log(removed);
    return await this.imageRepository.remove(image);
  }
}
