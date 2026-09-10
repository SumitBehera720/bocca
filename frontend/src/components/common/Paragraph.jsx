import React from 'react';

const Paragraph = ({ pera, style = '' }) => {
  return (
    <p className={`text-base font-light text-text leading-relaxed ${style}`}>
      {pera}
    </p>
  );
};

export default Paragraph;
