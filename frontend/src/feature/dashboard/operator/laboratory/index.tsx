import { useRouter } from "next/router";
import { apiLaboratory } from "@api/service/laboratory";
import { useQuery } from "@tanstack/react-query";
import LaboratoriesList from "./laboratories-list";
import AddLaboratory from "./lab-info-submition/create-laboratory";

const Laboratory = () => {
  const router = useRouter();
  // get laboratories data
  const { data: laboratories, isLoading: laboratoriesLoading } = useQuery(
    apiLaboratory().getAll({
      search: router.query.search_lab,
    }),
  );

  return router.query.lab === "new" ? (
    <AddLaboratory />
  ) : (
    <LaboratoriesList laboratories={laboratories?.data} />
  );
};

export default Laboratory;
