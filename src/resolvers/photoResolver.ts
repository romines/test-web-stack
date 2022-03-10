import { Query, Resolver, Mutation, Arg } from 'type-graphql';
import { Photo, PhotoInput } from '../models/Photo';

@Resolver((_of) => Photo)
export class PhotoResolver {
  @Query(() => [Photo])
  async getPhotos(): Promise<Photo[]> {
    return Photo.find();
  }

  @Mutation((_returns) => Photo)
  async addPhoto(@Arg('photoInput') { url }: PhotoInput): Promise<Photo> {
    const photo = Photo.create({
      url,
    });

    await photo.save();
    return photo;
  }
}
