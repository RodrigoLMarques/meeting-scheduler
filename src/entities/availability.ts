export enum AvailabilityStatus {
  AVAILABLE = "available",
  MAYBE = "maybe",
  UNAVAILABLE = "unavailable",
}

export class Availability {
  private _participant_id: string;
  private _time_slot_id: string;
  private _status!: AvailabilityStatus;

  constructor(
    participant_id: string,
    time_slot_id: string,
    status: AvailabilityStatus
  ) {
    this._participant_id = participant_id;
    this._time_slot_id = time_slot_id;
    this.status = status;
  }

  get participant_id(): string {
    return this._participant_id;
  }

  get time_slot_id(): string {
    return this._time_slot_id;
  }

  get status(): AvailabilityStatus {
    return this._status;
  }

  set status(value: AvailabilityStatus) {
    if (!value || value.trim().length === 0) {
      throw new Error("Status é obrigatório");
    }

    const validStatuses = Object.values(AvailabilityStatus);
    if (!validStatuses.includes(value)) {
      throw new Error(
        `Status inválido. Valores permitidos: ${validStatuses.join(", ")}`
      );
    }

    this._status = value;
  }

  toJSON() {
    return {
      participant_id: this._participant_id,
      time_slot_id: this._time_slot_id,
      status: this._status,
    };
  }
}
