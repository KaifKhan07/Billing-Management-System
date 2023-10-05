import React from "react";
import { Link } from "react-router-dom";


const Thankyou = () => {
    return (
      <>
      <div className="Thankyou">
        <h1>Thank You, Your Payment Has Been Sucessfull ! </h1>
        <Link className="btn btn-success custom-menu" to="/">Go back to Home</Link>

      </div>
      </>
    );
  };
export default Thankyou;