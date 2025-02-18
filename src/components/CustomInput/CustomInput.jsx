import React, { forwardRef } from "react";
import { Input } from "antd";

const CustomInput = forwardRef((props, ref) => <Input {...props} ref={ref} />);

export default CustomInput;
