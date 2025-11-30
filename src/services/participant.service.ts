import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Participant } from "../entities/participant";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../exceptions/appError";
import { ParticipantRepository } from "../repositories/participant.repository";
import { EventRepository } from "../repositories/event.repository";

export interface ICreateParticipantDTO {
  event_id: string;
  name: string;
  password: string;
  role?: string;
}

export interface IUpdateParticipantDTO {
  name?: string;
  password?: string;
  role?: string;
}

export interface ILoginParticipantDTO {
  event_id: string;
  name: string;
  password: string;
}

export interface ILoginResponse {
  participant: {
    id: string;
    event_id: string;
    name: string;
    role: string;
  };
  token: string;
}

class ParticipantService {
  private participantRepository: ParticipantRepository;
  private eventRepository: EventRepository;

  constructor() {
    this.participantRepository = new ParticipantRepository();
    this.eventRepository = new EventRepository();
  }

  async getById(id: string): Promise<Participant> {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new NotFoundError("Participante não encontrado");
    }

    return participant;
  }

  async getByEventId(event_id: string): Promise<Participant[]> {
    const participants =
      await this.participantRepository.findByEventId(event_id);
    return participants;
  }

  async create(data: ICreateParticipantDTO): Promise<Participant> {
    const event = await this.eventRepository.findById(data.event_id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    const existingParticipant =
      await this.participantRepository.findByEventAndName(
        data.event_id,
        data.name,
      );

    if (existingParticipant) {
      throw new ConflictError(
        "Já existe um participante com este nome neste evento",
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    const participant = new Participant(
      crypto.randomUUID(),
      data.event_id,
      data.name,
      hashedPassword,
      data.role,
    );

    await this.participantRepository.create(participant);

    return participant;
  }

  async login(data: ILoginParticipantDTO): Promise<ILoginResponse> {
    const participant = await this.participantRepository.findByEventAndName(
      data.event_id,
      data.name,
    );

    if (!participant) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      participant.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const jwtSecret = process.env.JWT_SECRET || "default-secret-key";
    const token = jwt.sign(
      {
        id: participant.id,
        event_id: participant.event_id,
        name: participant.name,
        role: participant.role,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      },
    );

    return {
      participant: {
        id: participant.id,
        event_id: participant.event_id,
        name: participant.name,
        role: participant.role,
      },
      token,
    };
  }

  async update(id: string, data: IUpdateParticipantDTO): Promise<Participant> {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new NotFoundError("Participante não encontrado");
    }

    if (data.name !== undefined) {
      const existingParticipant =
        await this.participantRepository.findByEventAndName(
          participant.event_id,
          data.name,
        );

      if (existingParticipant && existingParticipant.id !== id) {
        throw new ConflictError(
          "Já existe um participante com este nome neste evento",
        );
      }

      participant.name = data.name;
    }

    if (data.password !== undefined) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      participant.password = hashedPassword;
    }

    if (data.role !== undefined) {
      participant.role = data.role;
    }

    await this.participantRepository.update(participant);

    return participant;
  }

  async delete(id: string): Promise<void> {
    const participant = await this.participantRepository.findById(id);

    if (!participant) {
      throw new NotFoundError("Participante não encontrado");
    }

    await this.participantRepository.delete(id);
  }
}

export const participantService = new ParticipantService();
