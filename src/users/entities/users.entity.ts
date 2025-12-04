import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from 'src/posts/entities/posts.entity';
@Entity()
export class UsersModel {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column({
    length: 20,
    unique: false,
  })
  nickname: String;

  @Column()
  email: String;

  @Column()
  password: String;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: String;
  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
