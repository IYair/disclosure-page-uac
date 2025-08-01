import { Injectable } from '@nestjs/common';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { createHash } from 'crypto';
import google, { Auth, drive_v3 } from 'googleapis';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>
  ) {}

  async authorize() {
    const keyData = fs.readFileSync(process.env.GOOGLE_DRIVE_CREDENTIALS);
    const key = JSON.parse(keyData.toString());
    const jwtClient = new Auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/drive']
    });
    await jwtClient.authorize();
    return jwtClient;
  }

  /*
  Input: file: Express.Multer.File
  Output: Promise<Image>
  Return value: Created or found image object
  Function: Creates a new image, saves file to disk, or returns existing image if hash matches
  Variables: uuid, extension, hasher, image, imageInDb
  Date: 02 - 06 - 2025
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
      /*fs.writeFile(
        process.cwd() + process.env.ASSETS_PATH + '/' + image.assetName,
        file.buffer,
        err => {
          if (err) {
            throw err;
          }
        }
      );*/
      const auth = await this.authorize();
      const drive = new drive_v3.Drive({
        auth: auth
      });
      const res = drive.files.create(
        {
          auth: auth,
          requestBody: {
            name: image.assetName,
            parents: [process.env.ASSETS_PATH],
            mimeType: file.mimetype
          },
          media: {
            mimeType: file.mimetype,
            body: file.buffer
          },
          fields: 'id'
        },
        function (err) {
          if (err) {
            throw err;
          }
        }
      );
      
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
  Return value: File path of the image
  Function: Finds an image by id and returns its file path
  Variables: image, file
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    const image = await this.imageRepository.findOneBy({ id: id });
    const auth = await this.authorize();
    const drive = new drive_v3.Drive({
      auth: auth
    });
    const res = await drive.files.list({
      q: `'${process.env.ASSETS_PATH}' in parents and name='${image.assetName}'`,
      fields: 'files(id, name)'
    });
    const file = await drive.files.get(
      {
        fileId: res.data.files[0].id,
        alt: 'media'
      },

      {
        responseType: 'stream'
      }
    );
    return { mimeType: image.mimeType, name: image.assetName, data: file.data };
  }

  /*
  Input: id: string, updateImageDto: UpdateImageDto
  Output: Promise<Image>
  Return value: Updated image object
  Function: Updates an image by id
  Variables: image
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateImageDto: UpdateImageDto) {
    const image = await this.imageRepository.findOneBy({ id: id });
    const auth = await this.authorize();
    const drive = new drive_v3.Drive({
      auth: auth
    });
    const res = await drive.files.list({
      q: `'${process.env.ASSETS_PATH}' in parents and name='${image.assetName}'`,
      fields: 'files(id)'
    });
    const driveId = res.data.files[0].id;
    await drive.files.update({
      fileId: driveId,
      auth: auth,
      requestBody: {
        mimeType: updateImageDto.file.mimetype ?? image.mimeType
      },
      media: {
        mimeType: updateImageDto.file?.mimetype ?? image.mimeType,
        body: updateImageDto.file ? updateImageDto.file.buffer : null
      }
    });
    return await this.imageRepository.save({ ...image, ...updateImageDto });
  }

  /*
  Input: id: string
  Output: Promise<Image>
  Return value: Removed image object
  Function: Removes an image by id
  Variables: image
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const image = await this.imageRepository.findOneBy({ id: id });
    const auth = await this.authorize();
    const drive = new drive_v3.Drive({
      auth: auth
    });
    const res = await drive.files.list({
      q: `'${process.env.ASSETS_PATH}' in parents and name='${image.assetName}'`,
      fields: 'files(id)'
    });
    const driveId = res.data.files[0].id;
    await drive.files.delete({
      fileId: driveId,
      auth: auth
    });
    return await this.imageRepository.remove(image);
  }
}
