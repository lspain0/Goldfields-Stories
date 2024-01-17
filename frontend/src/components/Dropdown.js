import React from "react";

import Select, { components } from "react-select";
import { groupedOptions } from "./docs/data";

const handleHeaderClick = id => {
  const node = document.querySelector(`#${id}`).parentElement
    .nextElementSibling;
  const classes = node.classList;
  if (classes.contains("collapsed")) {
    node.classList.remove("collapsed");
  } else {
    node.classList.add("collapsed");
  }
};

const CustomGroupHeading = props => {
  return (
    <div
      className="group-heading-wrapper"
      onClick={() => handleHeaderClick(props.id)}
    >
      <components.GroupHeading {...props} />
    </div>
  );
};

const Dropdown = () => (
  <div className="container">
    <Select
      options={groupedOptions}
      isMulti
      blurInputOnSelect={false}
      closeMenuOnSelect={false}
      components={{ GroupHeading: CustomGroupHeading }}
      /* formatOptionLabel={(option, context) => {
        return (
          <React.Fragment>
            <input type="checkbox" />
            <label>{option.label}</label>
          </React.Fragment>
        );
      }} */
    />
  </div>
);

export default Dropdown;
