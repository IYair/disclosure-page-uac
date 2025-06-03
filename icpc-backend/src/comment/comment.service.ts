import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>
  ) {}

  /*
  Input: createCommentDto: CreateCommentDto
  Output: Promise<{ id: string; body: string } | { message: string }>
  Return value: New comment object or message if already exists
  Function: Creates a new comment if it doesn't exist
  Variables: body, comment, newComment
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async create(createCommentDto: CreateCommentDto) {
    const body = await this.findOneByBody(createCommentDto.body);
    // Check if a comment with the same body already exists
    // If it exists, return a message indicating that the comment already exists
    if (body !== null) {
      return {
        message: 'Comment already exists'
      };
    }
    const comment = this.commentRepository.create(createCommentDto);
    const newComment = await this.commentRepository.save(comment);
    return {
      id: newComment.id,
      body: newComment.body
    };
  }

  /*
  Input: None
  Output: Promise<Comment[]>
  Return value: Array of all comments
  Function: Retrieves all comments
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findAll() {
    return await this.commentRepository.find();
  }

  /*
  Input: id: string
  Output: Promise<Comment | null>
  Return value: Comment object or null
  Function: Finds a comment by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOne(id: string) {
    return await this.commentRepository.findOneBy({ id });
  }

  /*
  Input: body: string
  Output: Promise<Comment | null>
  Return value: Comment object or null
  Function: Finds a comment by its body
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async findOneByBody(body: string) {
    return await this.commentRepository.findOneBy({ body });
  }

  /*
  Input: id: string, updateCommentDto: UpdateCommentDto
  Output: Promise<UpdateResult>
  Return value: Result of update operation
  Function: Updates a comment by id
  Variables: None
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async update(id: string, updateCommentDto: UpdateCommentDto) {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  /*
  Input: id: string
  Output: Promise<Comment>
  Return value: Removed comment object
  Function: Removes a comment by id
  Variables: comment
  Date: 02 - 06 - 2025
  Author: Gerardo Omar Rodriguez Ramirez
  */
  async remove(id: string) {
    const comment = await this.findOne(id);
    return await this.commentRepository.remove(comment);
  }
}
