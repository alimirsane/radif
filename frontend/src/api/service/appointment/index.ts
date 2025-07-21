import { createInstanceCreator, ServiceBase } from "@api/service";
import { AppointmentType, QueueType } from "./type";

class ApiAppointment extends ServiceBase {
  getAllAvailable<RES = AppointmentType[]>(params?: {}) {
    return super.query<RES>({
      params,
      url: this.url + "appointments/available/",
    });
  }

  getAllQueues<RES = QueueType[]>(params?: {}) {
    return super.query<RES>({
      params,
      url: this.url + "queues/",
    });
  }

  getAllAppointments<RES = AppointmentType[]>(params?: {}) {
    return super.query<RES>({
      params,
      url: this.url + "appointments/",
    });
  }

  getOwnedAppointments<RES = AppointmentType[]>(params?: {}) {
    return super.query<RES>({
      params,
      url: this.url + "appointments/owned/",
    });
  }

  setAppointment<
    RES = AppointmentType,
    REQ = Pick<
      AppointmentType,
      "start_time" | "status" | "queue" | "reserved_by" | "request"
    >,
  >() {
    return super.create<RES, REQ>({
      url: this.url + "appointments/",
    });
  }

  createQueue<
    RES = QueueType,
    REQ = Omit<QueueType, "id" | "reserved_by_obj" | "appointments">,
  >() {
    return super.create<RES, REQ>({
      url: this.url + "queues/",
    });
  }

  updateQueue<
    RES = QueueType,
    REQ = Omit<QueueType, "id" | "reserved_by_obj" | "appointments">,
  >(queueId: number | undefined) {
    return super.updateAll<RES, REQ>({
      url: this.url + "queues/" + queueId + "/",
    });
  }

  updateQueueStatus<RES = QueueType, REQ = Pick<QueueType, "status">>(
    queueId: number | undefined,
  ) {
    return super.updateAll<RES, REQ>({
      url: this.url + "queues/" + queueId + "/",
    });
  }

  deleteQueue<RES = QueueType>(queueId: number) {
    return super.delete<RES>(`queues/${queueId}/`);
  }

  deleteAppointment<RES = AppointmentType>(appointmentId: number) {
    return super.delete<RES>(`appointments/${appointmentId}/`);
  }
}

export const apiAppointment = createInstanceCreator(
  "/appointment/",
  ApiAppointment,
);
