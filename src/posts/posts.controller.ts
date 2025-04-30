import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  // GET /posts
  // 모든 post를 가져온다
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }
  // 2)GET /posts/:id
  // 특정 id를 가진 post를 가져온다
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPostById(Number(+id));
  }
  // 3)POST /posts
  // 새로운 post를 생성한다
  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(author, title, content);
  }
  // 4)PUT /posts/:id
  // 특정 id를 가진 post를 수정한다
  @Put(':id')
  putPosts(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, author, title, content);
  }
  // 5)DELETE /posts/:id
  // 특정 id를 가진 post를 삭제한다
  @Delete(':id')
  deletePosts(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
