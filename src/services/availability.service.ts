import { Availability, AvailabilityStatus } from "../entities/availability";
import { NotFoundError, UnauthorizedError } from "../exceptions/appError";
import { JwtPayload } from "../middlewares/auth.middleware";
import { AvailabilityRepository } from "../repositories/availability.repository";
import { ParticipantRepository } from "../repositories/participant.repository";
import { TimeSlotRepository } from "../repositories/timeSlot.repository";

export interface ISetAvailabilitiesDTO {
  participant_id: string;
  authenticatedParticipant: JwtPayload;
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
    if (data.authenticatedParticipant.id !== data.participant_id) {
      throw new UnauthorizedError(
        "Você não tem permissão para alterar a disponibilidade de outro participante"
      );
    }

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
}

export const availabilityService = new AvailabilityService();
