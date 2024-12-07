import React, { useState } from "react";

import { ReactComponent as AddIcon } from "../../assets/icons/AddIcon.svg";
import { StyledButton } from "../../ui/StyledButton";
import AddSubscription from "../../components/subscription/AddSubscription";
const Subscription = ({ id }) => {
  const [open, setOpen] = useState(false);
  const [isChange, setIsChange] = useState(false);
  return (
    <>
      <StyledButton
        variant={"primary"}
        name={
          <>
            <AddIcon />
            Add Subscription
          </>
        }
        onClick={() => setOpen(true)}
      />
      <AddSubscription
        open={open}
        onClose={() => setOpen(false)}
        data={id}
        onChange={() => setIsChange(!isChange)}
      />
    </>
  );
};

export default Subscription;
