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

  toJSON() {
    return {
      id: this._id,
      name: this._name,
    };
  }
}
