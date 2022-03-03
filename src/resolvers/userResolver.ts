import { Query, Resolver, Mutation, Arg } from 'type-graphql'
import { User, UserInput } from '../schemas/User'
import { v4 as uuidv4 } from 'uuid'

@Resolver((of) => User)
export class UserResolver {
  private users: User[] = []

  @Query((returns) => [User], { nullable: true })
  async getUsers(): Promise<User[]> {
    return this.users
  }

  @Mutation((returns) => User)
  async addUser(
    @Arg('userInput') { name, dob, address, description }: UserInput
  ): Promise<User> {
    const user = {
      id: uuidv4(),
      name,
      dob,
      address,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(user)
    return user
  }
}
