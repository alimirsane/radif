import { Button } from "@kit/button";
import { useQuery } from "@tanstack/react-query";
import { apiLaboratory } from "@api/service/laboratory";
import { apiExperiment } from "@api/service/experiment";
const ServiceSample = () => {
  const { data: laboratories, isLoading: laboratoriesLoading } = useQuery(
    apiLaboratory().getAll(),
  );
  const { data: experiments } = useQuery(apiExperiment().getAll());

  return (
    <>
      <Button>سرویس گرفتن لیست آزمایشگاه‌ها</Button>
      {JSON.stringify(laboratories)}
    </>
  );
};

export default ServiceSample;
