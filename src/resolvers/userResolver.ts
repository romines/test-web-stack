import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { User, UserInput } from '../models/User';

@Resolver((_of) => User)
export class UserResolver {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    return User.find();
  }

  @Mutation((_returns) => User)
  async addUser(@Arg('userInput') { name, dob, address, description }: UserInput): Promise<User> {
    const user = User.create({
      name,
      dob,
      address,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await user.save();
    return user;
  }
}
