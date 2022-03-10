import { Field, InputType, ObjectType, ID } from 'type-graphql';
import { User } from './User';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
@ObjectType()
export class Photo extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  url: string;

  @Field(() => User, { nullable: true })
  @OneToOne(() => User, (user: User) => user.photo)
  user: User;
}

@InputType()
export class PhotoInput implements Partial<Photo> {
  @Field()
  url: string;
}
