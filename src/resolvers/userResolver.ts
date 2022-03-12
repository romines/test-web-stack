import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { User, NewUserInput, UpdateUserInput } from '../models/User';
import { Photo } from '../models/Photo';

@Resolver((_of) => User)
export class UserResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find();
  }

  @Mutation((_returns) => User)
  async addUser(@Arg('userInput') { name, dob, address, description, photoId }: NewUserInput): Promise<User> {
    let photo: Photo | null = null;
    if (photoId) {
      photo = await Photo.findOne({ id: photoId });
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
      photo = await Photo.findOne(data.photoId);
      delete data.photoId;
    }

    await User.update({ id }, { ...data, photo });
    const user = await User.findOne(id);
    return user;
  }
}
