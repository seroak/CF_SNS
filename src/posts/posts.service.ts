import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
// export interface PostsModel {
//   id: number;
//   author: string;
//   title: string;
//   content: string;
//   likeCount: number;
//   commentCount: number;
// }

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
  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  createPost(author: string, title: string, content: string) {
    // 1) create => 저장할 객체를 생성한다.
    // 2) save => 생성한 객체를 저장한다.(create 메서드에서 생성한 객체로)
    const post = this.postsRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(
    postId: number,
    author?: string,
    title?: string,
    content?: string,
  ) {
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });
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
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });
    if (!post) {
      throw new NotFoundException();
    }
    await this.postsRepository.delete(postId);

    return postId;
  }
}
