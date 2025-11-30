import { AvailabilityStatus } from "../entities/availability";
import { HeatmapRepository } from "../repositories/heatmap.repository";

export interface IHeatmapParticipant {
  id: string;
  name: string;
  status: AvailabilityStatus;
}

export interface IHeatmapSlot {
  time_slot_id: string;
  start_time: Date;
  end_time: Date;
  total_participants: number;
  available_count: number;
  maybe_count: number;
  unavailable_count: number;
  participants: IHeatmapParticipant[];
}

class HeatmapService {
  private heatmapRepository: HeatmapRepository;

  constructor() {
    this.heatmapRepository = new HeatmapRepository();
  }

  async getHeatmapByEvent(event_id: string): Promise<IHeatmapSlot[]> {
    const { timeSlots, participants } =
      await this.heatmapRepository.findEventHeatmapData(event_id);

    const heatmapData: IHeatmapSlot[] = [];

    for (const timeSlot of timeSlots) {
      const availabilityMap = new Map<string, AvailabilityStatus>();
      for (const availability of timeSlot.availabilities) {
        availabilityMap.set(
          availability.participant.id,
          availability.status as AvailabilityStatus
        );
      }

      let available_count = 0;
      let maybe_count = 0;
      let unavailable_count = 0;

      const participantsList: IHeatmapParticipant[] = participants.map(
        (participant) => {
          const status =
            availabilityMap.get(participant.id) ||
            AvailabilityStatus.UNAVAILABLE;

          if (status === AvailabilityStatus.AVAILABLE) {
            available_count++;
          } else if (status === AvailabilityStatus.MAYBE) {
            maybe_count++;
          } else {
            unavailable_count++;
          }

          return {
            id: participant.id,
            name: participant.name,
            status,
          };
        }
      );

      heatmapData.push({
        time_slot_id: timeSlot.id,
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        total_participants: participants.length,
        available_count,
        maybe_count,
        unavailable_count,
        participants: participantsList,
      });
    }

    return heatmapData;
  }
}

export const heatmapService = new HeatmapService();
