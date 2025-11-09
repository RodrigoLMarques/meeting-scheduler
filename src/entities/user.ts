export class User {
  private _id: string;
  private _name: string;
  private _password: string;

  constructor(
    id: string,
    name: string,
    password: string,
  ) {
    this._id = id;
    this._name = name;
    this._password = password;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  static validate(name: string, password: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Nome não pode ser vazio");
    }
    if (!password || password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
    };
  }
}
