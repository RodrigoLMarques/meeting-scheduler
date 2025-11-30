import { PrismaClient } from "@prisma/client";
import { Availability } from "../entities/availability";

const prisma = new PrismaClient();

export class AvailabilityRepository {
  async findByParticipantId(participant_id: string): Promise<Availability[]> {
    const availabilities = await prisma.availability.findMany({
      where: { participant_id },
    });

    return availabilities.map(
      (data) =>
        new Availability(data.participant_id, data.time_slot_id, data.status)
    );
  }

  async findByTimeSlotId(time_slot_id: string): Promise<Availability[]> {
    const availabilities = await prisma.availability.findMany({
      where: { time_slot_id },
    });

    return availabilities.map(
      (data) =>
        new Availability(data.participant_id, data.time_slot_id, data.status)
    );
  }

  async findById(
    participant_id: string,
    time_slot_id: string
  ): Promise<Availability | null> {
    const availability = await prisma.availability.findUnique({
      where: {
        participant_id_time_slot_id: {
          participant_id,
          time_slot_id,
        },
      },
    });

    if (!availability) {
      return null;
    }

    return new Availability(
      availability.participant_id,
      availability.time_slot_id,
      availability.status
    );
  }

  async create(availability: Availability): Promise<void> {
    await prisma.availability.create({
      data: {
        participant_id: availability.participant_id,
        time_slot_id: availability.time_slot_id,
        status: availability.status,
      },
    });
  }

  async update(availability: Availability): Promise<void> {
    await prisma.availability.update({
      where: {
        participant_id_time_slot_id: {
          participant_id: availability.participant_id,
          time_slot_id: availability.time_slot_id,
        },
      },
      data: {
        status: availability.status,
      },
    });
  }

  async delete(participant_id: string, time_slot_id: string): Promise<void> {
    await prisma.availability.delete({
      where: {
        participant_id_time_slot_id: {
          participant_id,
          time_slot_id,
        },
      },
    });
  }

  async deleteByParticipantId(participant_id: string): Promise<void> {
    await prisma.availability.deleteMany({
      where: {
        participant_id,
      },
    });
  }

  async createMany(availabilities: Availability[]): Promise<void> {
    await prisma.availability.createMany({
      data: availabilities.map((availability) => ({
        participant_id: availability.participant_id,
        time_slot_id: availability.time_slot_id,
        status: availability.status,
      })),
    });
  }
}
