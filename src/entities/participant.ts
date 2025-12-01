export enum ParticipantRole {
  ORGANIZER = "organizer",
  PARTICIPANT = "participant",
}

export class Participant {
  private _id: string;
  private _event_id: string;
  private _name!: string;
  private _password!: string;
  private _role!: ParticipantRole;

  constructor(
    id: string,
    event_id: string,
    name: string,
    password: string,
    role: ParticipantRole
  ) {
    this._id = id;
    this._event_id = event_id;
    this.name = name;
    this.password = password;
    this.role = role;
  }

  get id(): string {
    return this._id;
  }

  get event_id(): string {
    return this._event_id;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get role(): ParticipantRole {
    return this._role;
  }

  set name(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("Nome não pode ser vazio");
    }
    this._name = value;
  }

  set password(value: string) {
    if (!value || value.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }
    this._password = value;
  }

  set role(value: ParticipantRole) {
    const validRoles = Object.values(ParticipantRole);
    if (!validRoles.includes(value)) {
      throw new Error(
        `Role inválida. Valores permitidos: ${validRoles.join(", ")}`
      );
    }
    this._role = value || ParticipantRole.PARTICIPANT;
  }

  toJSON() {
    return {
      id: this._id,
      event_id: this._event_id,
      name: this._name,
      role: this._role,
    };
  }
}
