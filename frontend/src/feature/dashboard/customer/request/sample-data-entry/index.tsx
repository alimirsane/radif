import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Samples from "./samples";
import Form from "./form";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcArrowLeft,
  IcArrowRight,
  IcCardList,
} from "@feature/kits/common/icons";
import CartSamples from "./cart-samples";
import { apiRequest } from "@api/service/request";
import { apiExperiment } from "@api/service/experiment";
import { apiFormResponse } from "@api/service/form-response";
import { useCurrentRequestHandler } from "../../../../../hook/current-request-handler";
import { FormType } from "@api/service/form/type";
import { useQueryClient } from "@tanstack/react-query";
import { FBElementProp } from "@module/form-builder/type/sample";
import { useCopySampleHandler } from "@hook/copy-sample-handler";

const SampleDataEntry = () => {
  const router = useRouter();

  const [activeForm, setActiveForm] = useState(false);
  const clientQuery = useQueryClient();

  const createSample = () => {
    setActiveForm(false);
    clientQuery.invalidateQueries({
      queryKey: [apiFormResponse().url],
    });
  };
  // get current request id
  const requestId = useCurrentRequestHandler((state) => state.requestId);

  const queryClient = useQueryClient();

  const { data: currentRequest } = useQuery({
    ...apiRequest().getById(requestId?.toString()),
    enabled: requestId !== undefined,
  });

  // get current request data
  const { data: request } = useQuery(
    apiRequest().getById(requestId?.toString() ?? ""),
  );
  // get experiment id of current request
  const experimentId = request?.data.experiment;
  // get current experiment data
  const { data: experiment } = useQuery(
    apiExperiment().getByIdPublic(experimentId?.toString() ?? ""),
  );
  // current experiment json form
  const experimentForm = (experiment?.data?.form_obj as FormType)?.json_init;
  // get samples of current request
  const {
    data: samplesList,
    isLoading: samplesLoading,
    refetch: refetchSamples,
  } = useQuery(apiFormResponse().getAll({ request: requestId ?? "-1" }));
  // form response create api
  const { mutateAsync } = useMutation(apiFormResponse(false).create());
  // add new sample
  const addSample = (json: FBElementProp[]) => {
    return mutateAsync({
      response_json: json,
      response: "",
      request: requestId ?? -1,
    });
  };

  const addSampleCopies = async () => {
    const { samples } = useCopySampleHandler.getState();

    // Collect all the promises from addSample
    const promises: Promise<any>[] = [];

    samplesList?.data.forEach((sample) => {
      const zustandSample = samples.find((s) => s.sample_id === sample.id);

      if (zustandSample) {
        for (let i = 0; i < zustandSample.count; i++) {
          // promises.push(addSample(sample.response_json));
        }
      }
    });

    // Wait for all the promises to resolve
    try {
      await Promise.all(promises);
      console.log("All samples have been added successfully.");
    } catch (err) {
      console.error("An error occurred while adding samples:", err);
    }
  };

  // useEffect
  useEffect(() => {
    refetchSamples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId, activeForm]);

  return !samplesList?.data.length ? (
    <Form
      click={createSample}
      json={experimentForm ?? []}
      requestId={requestId ?? 0}
    />
  ) : !activeForm ? (
    <>
      <Samples
        experiment={request?.data?.experiment_obj?.name ?? ""}
        unitType={request?.data?.experiment_obj?.test_unit_type ?? ""}
        samples={samplesList?.data ?? []}
        click={() => setActiveForm(true)}
      />
      <CartSamples />
      {/* <CartSamples numberOfSample={samplesList?.data.length ?? 0} /> */}
      <div className="flex flex-col-reverse justify-end pt-3 sm:flex-row sm:py-7">
        {router.query.action === "add" && (
          <Button
            className="my-2 w-full sm:my-auto sm:ml-5 sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
              >
                <IcCardList />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              router.query.step = "6";
              router.push(router);
            }}
          >
            آزمون‌های ثبت شده
          </Button>
        )}
        {!request?.data?.is_completed && (
          <Button
            className="my-2 w-full sm:my-auto sm:ml-5 sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcArrowRight />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              router.query.step = (Number(router.query.step) - 1).toString();
              router.push(router);
            }}
          >
            شرایط و قوانین
          </Button>
        )}
        <Button
          variant="solid"
          color="primary"
          className="my-2 w-full sm:my-auto sm:w-auto"
          endIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowLeft />
            </SvgIcon>
          }
          onClick={() => {
            // addSampleCopies().then(() => {
            queryClient.invalidateQueries({
              queryKey: [apiFormResponse().url],
            });
            router.query.step = (Number(router.query.step) + 1).toString();
            router.push(router);
            // });
          }}
        >
          ثبت نهایی نمونه‌ها
        </Button>
      </div>
    </>
  ) : (
    <Form
      click={createSample}
      json={experimentForm ?? []}
      requestId={requestId ?? 0}
      closed={() => {
        setActiveForm(false);
      }}
    />
  );
};

export default SampleDataEntry;

{
  /* { samplesList?.data.length ? (
        <>
          <Samples
            samples={samplesList?.data ?? []}
            click={() => setActiveForm(true)}
          />
          <CartSamples numberOfSample={samplesList?.data.length ?? 0} />

          <div className="flex flex-col justify-end pt-3 sm:flex-row sm:py-7">
            <Button
              className="my-3 w-full sm:mx-5 sm:my-auto sm:w-auto"
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcArrowRight />
                </SvgIcon>
              }
              variant="outline"
              onClick={() => {
                router.query.step = (Number(router.query.step) - 1).toString();
                router.push(router);
              }}
            >
              شرایط و قوانین
            </Button>
            <Button
              variant="solid"
              color="primary"
              className="w-full sm:w-auto"
              endIcon={
                <SvgIcon
                  fillColor={"white"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcArrowLeft />
                </SvgIcon>
              }
              onClick={() => {
                router.query.step = (Number(router.query.step) + 1).toString();
                router.push(router);
              }}
            >
              ثبت نهایی درخواست
            </Button>
          </div>
        </>
      ) : (

      )} */
}
