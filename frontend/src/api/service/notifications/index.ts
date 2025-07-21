import { createInstanceCreator, ServiceBase } from "@api/service";
import { NotificationType, NotificationUpdate } from "./type";

class ApiNotification extends ServiceBase {
  // override getAll<RES = NotificationsType>() {
  //   return super.getAll<RES>();
  // }

  getAllNotifs<RES = Array<NotificationType>>(params?: {}) {
    return super.getAllPagination<RES>({
      params,
      url: this.url + "",
    });
  }

  override getById<RES = NotificationType>(notifyId: string) {
    return super.getById<RES>(notifyId);
  }

  update<RES = NotificationType, REQ = NotificationUpdate>(
    id: string | undefined,
  ) {
    return super.updateAll<RES, REQ>({
      url: this.url + id + "/read/",
      formData: true,
    });
  }

  readAll<RES = Array<NotificationType>>() {
    return super.getAllPagination<RES>({
      url: this.url + "read-all",
    });
  }
}

export const apiNotification = createInstanceCreator(
  "/accounts/notification/",
  ApiNotification,
);
