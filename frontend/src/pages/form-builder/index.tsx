import { FBLoader } from "../../module/form-builder/loader";
import { sampleFB } from "../../module/form-builder/sample";

const FormBuilder = () => {
  return <FBLoader jsonFB={sampleFB.data.json} submitFB={() => {}} />;
};

export default FormBuilder;
