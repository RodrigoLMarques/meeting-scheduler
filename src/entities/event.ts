export class Event {
  private _id: string;
  private _title!: string;
  private _description!: string;
  private _date_start!: Date;
  private _date_end!: Date;
  private _time_earliest!: string;
  private _time_latest!: string;
  private _timezone!: string;
  private _url_slug!: string;

  constructor(
    id: string,
    title: string,
    description: string,
    date_start: Date,
    date_end: Date,
    time_earliest: string = "08:00",
    time_latest: string = "18:00",
    timezone: string = "America/Sao_Paulo",
    url_slug?: string
  ) {
    this._id = id;
    this.description = description;
    this.timezone = timezone;
    this.date_start = date_start;
    this.date_end = date_end;
    this.title = title;
    this.date_start = date_start;
    this.date_end = date_end;
    this.time_earliest = time_earliest;
    this.time_latest = time_latest;

    if (url_slug) {
      this._url_slug = url_slug;
    }
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get date_start(): Date {
    return this._date_start;
  }

  get date_end(): Date {
    return this._date_end;
  }

  get time_earliest(): string {
    return this._time_earliest;
  }

  get time_latest(): string {
    return this._time_latest;
  }

  get timezone(): string {
    return this._timezone;
  }

  get url_slug(): string {
    return this._url_slug;
  }

  set title(value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error("O título deve ter pelo menos 3 caracteres.");
    }
    this._title = value;
    this._url_slug = this.generateSlug(value);
  }

  set description(value: string) {
    this._description = value;
  }

  set date_start(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("dateStart inválido.");
    }
    if (this._date_end && value >= this._date_end) {
      throw new Error("dateStart deve ser anterior a dateEnd.");
    }
    this._date_start = value;
  }

  set date_end(value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error("dateEnd inválido.");
    }
    if (this._date_start && value <= this._date_start) {
      throw new Error("dateEnd deve ser posterior a dateStart.");
    }
    this._date_end = value;
  }

  set time_earliest(value: string) {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(value)) {
      throw new Error("time_earliest deve estar no formato HH:mm");
    }
    this._time_earliest = value;
  }

  set time_latest(value: string) {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timePattern.test(value)) {
      throw new Error("time_latest deve estar no formato HH:mm");
    }
    this._time_latest = value;
  }

  set timezone(value: string) {
    this._timezone = value;
  }

  toJSON() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      date_start: this._date_start,
      date_end: this._date_end,
      time_earliest: this._time_earliest,
      time_latest: this._time_latest,
      timezone: this._timezone,
      url_slug: this._url_slug,
    };
  }
}
