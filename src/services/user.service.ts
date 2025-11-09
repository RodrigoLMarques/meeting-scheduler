import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";
import { BadRequestError, ConflictError } from "../exceptions/appError";

export interface ICreateUserDTO {
  name: string;
  password: string;
}

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    return users;
  }

  async create(data: ICreateUserDTO): Promise<User> {
    try {
      User.validate(data.name, data.password);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }

    const existingUser = await this.userRepository.findByName(data.name);

    if (existingUser) {
      throw new ConflictError("Nome de usuário já está em uso");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const user = new User(crypto.randomUUID(), data.name, hashedPassword);
    await this.userRepository.create(user);

    return user;
  }
}

export const userService = new UserService();
