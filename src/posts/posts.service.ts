import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
export interface PostsModel {
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

@Injectable()
export class PostsService {
  constructor(
    // @InjectRepository 데코레이터를 사용하여 PostsModel 엔티티에 대한 Repository를 주입받는다
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find();
  }
  getPostById(id: number) {
    const post = posts.find((post) => post.id === Number(id));
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  createPost(author: string, title: string, content: string) {
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
  updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    const post = posts.find((post) => post.id === Number(postId));
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
      prevPost.id === Number(postId) ? post : prevPost,
    );
    return posts;
  }
  deletePost(postId: number) {
    const post = posts.find((post) => post.id === Number(postId));
    if (!post) {
      throw new NotFoundException();
    }
    posts = posts.filter((post) => post.id !== Number(postId));

    return postId;
  }
}
