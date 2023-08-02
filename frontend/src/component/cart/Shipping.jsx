import React, { useState } from "react";
import "./Shipping.css";
import { useDispatch } from "react-redux";
import CheckoutSteps from "../cart/CheckoutSteps.jsx";
import MetaData from "../../more/MetaData";
import HomeIcon from "@material-ui/icons/Home";
import PublicIcon from "@material-ui/icons/Public";
import PhoneIcon from "@material-ui/icons/Phone";
import TransferWithinAStationIcon from "@material-ui/icons/TransferWithinAStation";
import { Country, State } from "country-state-city";
// import { saveShippingInfo } from "../../actions/CartAction";
import BottomTab from "../../more/BottomTab";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
// import ConfirmOrder from "./ConfirmOrder";
import { shippingInfoDetails } from "../../redux/shippingInfoSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  console.log("JS");
  // const { shippingInfo } = useSelector((state) => state.cart);

  // const [address, setAddress] = useState(shippingInfo.address);
  const [address, setAddress] = useState("");
  // eslint-disable-next-line
  // const [state, setState] = useState(shippingInfo.state);
  const [state, setState] = useState("");
  // const [country, setCountry] = useState(shippingInfo.country);
  const [country, setCountry] = useState("");
  // eslint-disable-next-line
  // const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
  const [phoneNo, setPhoneNo] = useState("");
  console.log({ address, state, country, phoneNo });

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 11 || phoneNo.length > 11) {
      toast.error("Phone Number should be 11digits");
      return;
    }
    dispatch(shippingInfoDetails({ address, state, country, phoneNo })).then((response) => {
      history("/order/confirm");
    })
    // ConfirmOrder({ address, state, country, phoneNo });
  };

  return (
    <>
      <MetaData title="Shipping Details" />
      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>

          <form
            className="shippingForm"
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <PhoneIcon />
              <input
                type="number"
                placeholder="Phone Number"
                required
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <PublicIcon />

              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div>
                <TransferWithinAStationIcon />

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">City</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
      <BottomTab />
    </>
  );
};

export default Shipping;