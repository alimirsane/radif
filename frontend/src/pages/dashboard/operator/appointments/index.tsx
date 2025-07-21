import Header from "@feature/dashboard/common/header";
import Container from "@feature/dashboard/common/container";
import Appointments from "@feature/dashboard/operator/appointments";
import ExperimentAppointments from "@feature/dashboard/operator/laboratory/experiment-info-submition/appointments";
import { useRouter } from "next/router";
import { Card } from "@kit/card";
import { Button } from "@kit/button";

const Index = () => {
  const router = useRouter();
  return (
    <Container>
      <Header
        title="نوبت دهی"
        description="کاربر گرامی شما می‌توانید وضعیت نوبت‌ها را در این قسمت مدیریت کنید."
      />

      {router.query.experiment === "view" ? (
        <Card
          className={"my-6 px-4 pb-10 pt-7 text-typography-main sm:px-8"}
          color={"white"}
          variant="outline"
        >
          <div className="flex flex-col items-center justify-between px-2 pb-2 md:flex-row">
            <p className="py-2 text-[14px]">
              وضعیت نوبت‌ها را می توانید در این بخش مشاهده و ویرایش کنید.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                router.push({
                  pathname: router.pathname,
                  query: {},
                });
              }}
            >
              مشاهده لیست آزمون‌ها
            </Button>
          </div>
          <ExperimentAppointments />
        </Card>
      ) : (
        <Appointments />
      )}
    </Container>
  );
};

export default Index;
