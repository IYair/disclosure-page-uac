import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res
} from '@nestjs/common';
import { ImageService } from './image.service';
import { UpdateImageDto } from './dto/update-image.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiBody,
  ApiTags
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('image')
@ApiTags('Image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  /*
  Input: file: Express.Multer.File
  Output: Promise<{ id: string, assetName: string }>
  Return value: Object with image id and assetName
  Function: Uploads an image
  Variables: file, image
  Route: POST /image/upload
  Access: User
  Method: POST
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Post('upload')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const image = await this.imageService.create(file);
    return {
      id: image.id,
      assetName: image.assetName
    };
  }

  /*
  Input: None
  Output: Promise<Image[]>
  Return value: Array of all images
  Function: Retrieves all images
  Variables: None
  Route: GET /image
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get()
  @ApiResponse({
    description: 'The image list has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async findAll() {
    return await this.imageService.findAll();
  }

  /*
  Input: id: string, res: any
  Output: void
  Return value: Sends image file in response
  Function: Retrieves an image by id and sends the file
  Variables: id, res, file
  Route: GET /image/:id
  Access: Public
  Method: GET
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Get(':id')
  @ApiResponse({
    description: 'The image has been successfully retrieved.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const file = await this.imageService.findOne(id);

    // Set the appropriate headers for the image
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);

    // Pipe the file stream to the response
    file.data.pipe(res);
  }

  /*
  Input: id: string, updateImageDto: UpdateImageDto
  Output: Promise<Image>
  Return value: Updated image entity
  Function: Updates an image by id
  Variables: id, updateImageDto
  Route: PATCH /image/:id
  Access: User
  Method: PATCH
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The image has been successfully updated.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.imageService.update(id, file);
  }

  /*
  Input: id: string
  Output: Promise<Image>
  Return value: Deleted image entity
  Function: Deletes an image by id
  Variables: id
  Route: DELETE /image/:id
  Access: User
  Method: DELETE
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiResponse({
    description: 'The image has been successfully deleted.'
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async remove(@Param('id') id: string) {
    return await this.imageService.remove(id);
  }
}
