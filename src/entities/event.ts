import { randomUUID } from "crypto";

export class Event {
    public readonly id: string;
    public title: string;
    public description: string;
    public dateStart: Date;
    public dateEnd: Date;
    public time_earliest: string;
    public time_latest: string;
    public timezone: string;
    public url_slug: string;

    constructor(
        title: string,
        dateStart: Date,
        dateEnd: Date,
        description: string,
        time_earliest: string = "08:00",
        time_latest: string = "18:00",
        timezone: string = "America/Sao_Paulo",
    ) {
        // ====== Validação do título ======
        if (!title || title.trim().length < 3) {
            throw new Error("O título deve ter pelo menos 3 caracteres.");
        }

        // ===== Validação das datas =====
        if (!(dateStart instanceof Date) || isNaN(dateStart.getTime())) {
            throw new Error("dateStart inválido.");
        }

        if (!(dateEnd instanceof Date) || isNaN(dateEnd.getTime())) {
            throw new Error("dateEnd inválido.");
        }

        if (dateEnd <= dateStart) {
            throw new Error("dateEnd deve ser posterior a dateStart.");
        }

        // ===== Validação do horário (HH:mm) =====
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timePattern.test(time_earliest)) {
            throw new Error("time_earliest deve estar no formato HH:mm");
        }

        if (!timePattern.test(time_latest)) {
            throw new Error("time_latest deve estar no formato HH:mm");
        }

        // ===== Atribuições =====
        this.id = randomUUID();
        this.title = title;
        this.description = description;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.time_earliest = time_earliest;
        this.time_latest = time_latest;
        this.timezone = timezone;

        // ===== Criar slug =====
        this.url_slug = this.createSlug(title);
    }

    private createSlug(text: string): string {
        return text
            .toLowerCase()
            .trim()
            .normalize("NFD")                // remove acentos
            .replace(/[\u0300-\u036f]/g, "") // remove marcas de acentuação
            .replace(/[^a-z0-9\s-]/g, "")    // remove chars especiais
            .replace(/\s+/g, "-");           // troca espaço por "-"
    }
}
