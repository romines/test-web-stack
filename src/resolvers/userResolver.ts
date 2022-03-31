import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User, NewUserInput, UpdateUserInput } from '../models/User';
import { Photo } from '../models/Photo';
import { ILike } from 'typeorm';
import { dataSource } from '..';

@ObjectType()
class UsersResponse {
  @Field((_type) => [User])
  users: User[];

  @Field((_type) => Int)
  count: number;
}

@Resolver((_of) => User)
export class UserResolver {
  @Query(() => UsersResponse)
  async users(
    @Arg('page') page: number,
    @Arg('search', { nullable: true }) search?: string,
  ): Promise<{ users: User[]; count: number }> {
    const where = {
      ...(search ? { name: ILike(`%${search}%`) } : {}),
    };
    const take = page * 6;
    const [users, count] = await dataSource.getRepository(User).findAndCount({
      order: {
        name: 'DESC',
      },
      where,
      take,
      skip: 0,
    });
    return { users, count };
  }

  @Mutation((_returns) => User)
  async addUser(@Arg('userInput') { name, dob, address, description, photoId }: NewUserInput): Promise<User> {
    let photo: Photo | null = null;
    if (photoId) {
      photo = await Photo.findOneBy({ id: photoId });
    }
    const user = User.create({
      name,
      dob,
      address,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      photo,
    });

    await user.save();
    return user;
  }

  @Mutation((_returns) => User)
  async updateUser(@Arg('id') id: string, @Arg('data') data: UpdateUserInput): Promise<User> {
    let photo: Photo | null = null;
    if (data.photoId) {
      photo = await Photo.findOneBy({ id: data.photoId });
      delete data.photoId;
    }

    await User.update({ id }, { ...data, photo });
    const user = await User.findOneBy({ id });
    return user;
  }
}
