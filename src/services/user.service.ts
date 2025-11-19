import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { ConflictError } from "../exceptions/appError";
import { UserRepository } from "../repositories/user.repository";

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
    const { name, password } = data;

    if (!name || name.trim().length === 0) {
      throw new Error("Nome não pode ser vazio");
    }
    if (!password || password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
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
