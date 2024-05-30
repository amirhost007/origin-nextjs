import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetMasterSettingQuery,
  usePartnerCommissionMutation,
} from "@/store/Slices/apiSlice";
import { errorMsg, successMsg } from "../Toast";
import ErrorHandler from "../ErrorHandler";

function MasterSettings({ staticData }) {
  const { lang, currency } = useSelector((state) => state.headData);
  const {
    data: masterData,
    isError,
    error,
  } = useGetMasterSettingQuery(
    { lang, ...(currency && { currency_id: currency }) },
    { refetchOnMountOrArgChange: true }
  );
  const [partnerCommission] = usePartnerCommissionMutation();
  const [commision, setCommission] = useState(
    masterData?.data?.master_setting?.surge_charge
      ? masterData?.data?.master_setting?.surge_charge
      : ""
  );

  const handleSubmit = async () => {
    if (commision) {
      const response = await partnerCommission({
        commission: commision,
      }).unwrap();
      if (response?.status) {
        response?.message && successMsg(response?.message);
        setCommission(0);
      } else {
        response?.message && errorMsg(response?.message);
      }
      try {
      } catch (error) {
        let err = error?.data?.message
          ? error?.data?.message
          : error?.message
          ? error?.message
          : "Something went wrong";
        if (err) errorMsg(err);
      }
    } else {
      errorMsg("Please insert surge charge");
    }
  };
  if (isError)
    return (
      <>
        <div>Something went wrong.</div> <ErrorHandler error={error} />
      </>
    );
  return (
    <>
      <h3 className="tab_drawer_heading" rel="tab4">
        <img src="/assets/img/user.svg" alt="" className="img-fluid" />{" "}
        {staticData?.data?.master_setting}
      </h3>
      <div id="tab4" className="tab_content">
        <h2>{masterData?.data?.master_setting?.master_setting_title}</h2>
        <section id="ld-lst" className="lodng-lst p-0 pb-4">
          <div className="container" data-aos="fade-up">
            <div className="content report-tile prcng">
              {/* <h2>
                {masterData?.data?.master_setting?.master_setting_heading}
                <span>{masterData?.data?.master_setting?.master_setting_commission}%</span>
              </h2> */}
              <h2>
                {staticData?.data?.your_surge_charge_is}
                <span>
                  {Math.round(
                    masterData?.data?.master_setting?.surge_charge * 100
                  ) / 100}
                  %
                </span>
              </h2>
              <div className="chr-cus">
                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <p>
                      {
                        masterData?.data?.master_setting
                          ?.master_setting_short_description
                      }
                    </p>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <input
                      type="text"
                      placeholder={staticData?.data?.surge_charge}
                      value={commision}
                      onChange={(e) => setCommission(e.target.value)}
                    />
                  </div>
                  <div className="offset-lg-2 col-lg-2 col-md-12">
                    <button
                      className="commission_add_btn"
                      onClick={handleSubmit}
                    >
                      {staticData?.data?.add}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default MasterSettings;
