import { PrismaClient } from "@prisma/client";
import { Participant } from "../entities/participant";

const prisma = new PrismaClient();

export class ParticipantRepository {
  async findById(id: string): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: { id },
    });

    if (!participant) {
      return null;
    }

    return new Participant(
      participant.id,
      participant.event_id,
      participant.name,
      participant.password,
      participant.role,
    );
  }

  async findByEventId(event_id: string): Promise<Participant[]> {
    const participants = await prisma.participant.findMany({
      where: { event_id },
    });

    return participants.map(
      (data) =>
        new Participant(
          data.id,
          data.event_id,
          data.name,
          data.password,
          data.role,
        ),
    );
  }

  async findByEventAndName(
    event_id: string,
    name: string,
  ): Promise<Participant | null> {
    const participant = await prisma.participant.findUnique({
      where: {
        event_id_name: {
          event_id,
          name,
        },
      },
    });

    if (!participant) {
      return null;
    }

    return new Participant(
      participant.id,
      participant.event_id,
      participant.name,
      participant.password,
      participant.role,
    );
  }

  async create(participant: Participant): Promise<void> {
    await prisma.participant.create({
      data: {
        id: participant.id,
        event_id: participant.event_id,
        name: participant.name,
        password: participant.password,
        role: participant.role,
      },
    });
  }

  async update(participant: Participant): Promise<void> {
    await prisma.participant.update({
      where: { id: participant.id },
      data: {
        name: participant.name,
        password: participant.password,
        role: participant.role,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.participant.delete({
      where: { id },
    });
  }
}
