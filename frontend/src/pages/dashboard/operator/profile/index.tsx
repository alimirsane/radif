import { Profile } from "@feature/dashboard/customer/profile";
import Container from "@feature/dashboard/common/container";
import { Button } from "@kit/button";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { apiRequestOtp } from "@api/service/request-otp";

const OperatorProfile = () => {
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    openModal(modalKey, user?.data.username);
  };
  // get user data
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  return (
    <Container>
      <div className="flex flex-row items-center justify-between pb-3">
        <h1 className="text-[24px] font-bold">حساب کاربری</h1>
        <Button
          variant="outline"
          onClick={handleOpenModal(ModalKeys.CUSTOMER_CHANGE_PASSWORD)}
        >
          تغییر رمز عبور
        </Button>
      </div>
      <Profile />
    </Container>
  );
};

export default OperatorProfile;
