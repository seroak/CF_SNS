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

interface PostsModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostsModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: 'New Jeans',
    content: 'New Jeans is a South Korean',
    likeCount: 1000,
    commentCount: 100,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: 'New Jeans is a South Korean',
    likeCount: 1000,
    commentCount: 100,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 리사',
    content: 'New Jeans is a South Korean',
    likeCount: 1000,
    commentCount: 100,
  },
  {
    id: 4,
    author: 'blackpink_official',
    title: '블랙핑크 제니',
    content: 'New Jeans is a South Korean',
    likeCount: 1000,
    commentCount: 100,
  },
];
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  // GET /posts
  // 모든 post를 가져온다
  @Get()
  getPosts(): PostsModel[] {
    return posts;
  }
  // 2)GET /posts/:id
  // 특정 id를 가진 post를 가져온다
  @Get(':id')
  getPost(@Param('id') id: string) {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  // 3)POST /posts
  // 새로운 post를 생성한다
  @Post()
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return posts;
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
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException();
    }
    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    posts = posts.map((prevPost) =>
      prevPost.id === Number(id) ? post : prevPost,
    );
    return posts;
  }
  // 5)DELETE /posts/:id
  // 특정 id를 가진 post를 삭제한다
  @Delete(':id')
  deletePosts(@Param('id') id: string) {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException();
    }
    posts = posts.filter((post) => post.id !== Number(id));

    return id;
  }
}
