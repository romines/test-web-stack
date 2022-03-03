import { Field, ObjectType, InputType } from 'type-graphql'

@ObjectType()
export class User {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  dob: Date

  @Field()
  address: string

  @Field()
  description: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  name: string

  @Field()
  dob: Date

  @Field()
  address: string

  @Field()
  description: string
}
