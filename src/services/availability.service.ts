import { Availability, AvailabilityStatus } from "../entities/availability";
import { NotFoundError } from "../exceptions/appError";
import { AvailabilityRepository } from "../repositories/availability.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { TimeSlotRepository } from "../repositories/timeSlot.repository";

export interface ISetAvailabilitiesDTO {
  participant_id: string;
  availabilities: Array<{
    time_slot_id: string;
    status: AvailabilityStatus;
  }>;
}

class AvailabilityService {
  private availabilityRepository: AvailabilityRepository;
  private participantRepository: ParticipantRepository;
  private timeSlotRepository: TimeSlotRepository;

  constructor() {
    this.availabilityRepository = new AvailabilityRepository();
    this.participantRepository = new ParticipantRepository();
    this.timeSlotRepository = new TimeSlotRepository();
  }

  async getByParticipantId(participant_id: string): Promise<Availability[]> {
    const availabilities =
      await this.availabilityRepository.findByParticipantId(participant_id);
    return availabilities;
  }

  async getByTimeSlotId(time_slot_id: string): Promise<Availability[]> {
    const availabilities = await this.availabilityRepository.findByTimeSlotId(
      time_slot_id
    );
    return availabilities;
  }

  async setAvailabilities(
    data: ISetAvailabilitiesDTO
  ): Promise<Availability[]> {
    const participant = await this.participantRepository.findById(
      data.participant_id
    );

    if (!participant) {
      throw new NotFoundError("Participante não encontrado");
    }

    const timeSlotIds = data.availabilities.map((item) => item.time_slot_id);
    const allTimeSlotsExist =
      await this.timeSlotRepository.validateTimeSlotsByIds(timeSlotIds);

    if (!allTimeSlotsExist) {
      throw new NotFoundError(
        "Um ou mais slots de tempo não foram encontrados"
      );
    }

    await this.availabilityRepository.deleteByParticipantId(
      data.participant_id
    );

    const availabilities = data.availabilities.map(
      (item) =>
        new Availability(data.participant_id, item.time_slot_id, item.status)
    );

    if (availabilities.length > 0) {
      await this.availabilityRepository.createMany(availabilities);
    }

    return availabilities;
  }

  async deleteByParticipantId(participant_id: string): Promise<void> {
    // Validar participante (1 query)
    const participant = await this.participantRepository.findById(
      participant_id
    );

    if (!participant) {
      throw new NotFoundError("Participante não encontrado");
    }

    // Deletar todas as disponibilidades de uma vez (1 query)
    await this.availabilityRepository.deleteByParticipantId(participant_id);
  }
}

export const availabilityService = new AvailabilityService();
