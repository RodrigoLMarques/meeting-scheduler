export class TimeSlot {
  private _id: string;
  private _event_id: string;
  private _start_time!: Date;
  private _end_time!: Date;

  constructor(id: string, event_id: string, start_time: Date, end_time: Date) {
    if (!event_id) {
      throw new Error("ID do evento é obrigatório");
    }

    this._id = id;
    this._event_id = event_id;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  get id(): string {
    return this._id;
  }

  get event_id(): string {
    return this._event_id;
  }

  get start_time(): Date {
    return this._start_time;
  }

  get end_time(): Date {
    return this._end_time;
  }

  set start_time(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("start_time inválido");
    }
    if (this._end_time && value >= this._end_time) {
      throw new Error("start_time deve ser anterior a end_time");
    }
    this._start_time = value;
  }

  set end_time(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("end_time inválido");
    }
    if (this._start_time && value <= this._start_time) {
      throw new Error("end_time deve ser posterior a start_time");
    }
    this._end_time = value;
  }

  toJSON() {
    return {
      id: this._id,
      event_id: this._event_id,
      start_time: this._start_time,
      end_time: this._end_time,
    };
  }
}
