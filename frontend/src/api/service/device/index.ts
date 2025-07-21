import { createInstanceCreator, ServiceBase } from "@api/service";
import { DeviceType } from "@api/service/device/type";

class ApiDevice extends ServiceBase {
  override getAll<RES = DeviceType>(params?: {}) {
    return super.getAll<RES>({ params });
  }

  override getById<RES = DeviceType>(laboratoryId: string) {
    return super.getById<RES>(laboratoryId);
  }

  override create<
    RES = DeviceType,
    REQ = Omit<DeviceType, "id" | "lab_name" | "device_obj">,
  >() {
    return super.create<RES, REQ>();
  }

  override delete<RES = DeviceType>(deviceId: string) {
    return super.delete<RES>(deviceId);
  }

  update<
    RES = DeviceType,
    REQ = Omit<DeviceType, "id" | "lab_name" | "device_obj">,
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/" });
  }
}

export const apiDevice = createInstanceCreator("/labs/devices/", ApiDevice);
