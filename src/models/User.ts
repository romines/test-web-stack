import { Field, ObjectType, InputType, ID } from 'type-graphql';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Photo } from './Photo';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  dob: Date;

  @Field(() => String)
  @Column()
  address: string;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => Date)
  @Column()
  updatedAt: Date;

  @Field(() => Photo, { nullable: true })
  @OneToOne(() => Photo, (photo) => photo.user, { nullable: true, eager: true })
  @JoinColumn()
  photo: Photo;
}

@InputType()
export class NewUserInput implements Partial<User> {
  @Field()
  name: string;

  @Field()
  dob: Date;

  @Field()
  address: string;

  @Field()
  description: string;

  @Field()
  photoId: string;
}

@InputType()
export class UpdateUserInput implements Partial<NewUserInput> {
  @Field({ nullable: true })
  name?: string | null;

  @Field({ nullable: true })
  dob?: Date | null;

  @Field({ nullable: true })
  address?: string | null;

  @Field({ nullable: true })
  description?: string | null;

  @Field()
  photoId?: string | null;
}
