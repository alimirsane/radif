import { createInstanceCreator, ServiceBase } from "@api/service";
import { IsoType } from "./type";

class ApiIso extends ServiceBase {
  override getAll<RES = IsoType>() {
    return super.getAll<RES>();
  }
  getIsoStatus<RES = IsoType>(params?: {}) {
    return super.query<RES>({ params });
  }
  updateIsoStatus<RES = IsoType, REQ = Pick<IsoType, "is_visible_iso">>() {
    return super.updateSome<RES, REQ>({
      url: this.url,
    });
  }
}

export const apiIso = createInstanceCreator(
  "/labs/laboratories/iso-visibility/",
  ApiIso,
);
