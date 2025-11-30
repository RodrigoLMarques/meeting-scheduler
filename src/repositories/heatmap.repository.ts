import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface HeatmapTimeSlot {
  id: string;
  start_time: Date;
  end_time: Date;
  availabilities: {
    participant: {
      id: string;
      name: string;
    };
    status: string;
  }[];
}

export interface HeatmapParticipant {
  id: string;
  name: string;
}

export interface HeatmapEventData {
  timeSlots: HeatmapTimeSlot[];
  participants: HeatmapParticipant[];
}

export class HeatmapRepository {
  async findEventHeatmapData(event_id: string): Promise<HeatmapEventData> {
    const [timeSlots, participants] = await Promise.all([
      prisma.timeSlot.findMany({
        where: { event_id },
        select: {
          id: true,
          start_time: true,
          end_time: true,
          availabilities: {
            select: {
              participant: {
                select: {
                  id: true,
                  name: true,
                },
              },
              status: true,
            },
          },
        },
        orderBy: {
          start_time: "asc",
        },
      }),
      prisma.participant.findMany({
        where: { event_id },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      timeSlots,
      participants,
    };
  }
}
