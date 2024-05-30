import { useSelector } from "react-redux";
import { useGetReferCodeQuery } from "@/store/Slices/apiSlice";
import { successMsg } from "../Toast";

function ReferFriends({ staticData }) {
  const { lang } = useSelector((state) => state.headData);
  const { data: referData } = useGetReferCodeQuery(
    { lang },
    { refetchOnMountOrArgChange: true }
  );
  const handleCopy = async () => {
    var copyText = document.getElementById("textforcopy").innerText;

    await navigator.clipboard.writeText(copyText);
    successMsg("Copied");
  };
  return (
    <>
      <h3 className="tab_drawer_heading" rel="tab3">
        <img src="/assets/img/user.svg" alt="" className="img-fluid" />{" "}
        {staticData?.data?.refer_friends}
      </h3>
      <div id="tab3" className="tab_content">
        <h2>{referData?.data?.refer_title}</h2>
        <p>{referData?.data?.refer_short_description}</p>
        <h3 className="cpy-lnk">
          <span id="textforcopy">{referData?.data?.refer_link}</span>
          <button onClick={handleCopy}>{staticData?.data?.copy_link}</button>
        </h3>
      </div>
    </>
  );
}

export default ReferFriends;
