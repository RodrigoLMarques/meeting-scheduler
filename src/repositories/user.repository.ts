import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user";

const prisma = new PrismaClient();

export class UserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map((data) => new User(data.id, data.name, data.password));
  }

  async findByName(name: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { name },
    });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.password);
  }

  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        password: user.password,
      },
    });
  }
}
