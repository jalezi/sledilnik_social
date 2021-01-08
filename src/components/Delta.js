import React from 'react';
import Separator from './Separator';
const Calculate = ({
  today,
  yesterday,
  getPrefix,
  noChanges,
  insideColons = false,
}) => {
  let deltaCalculation = today - yesterday;

  const prefix = getPrefix
    ? today - yesterday === 0
      ? ''
      : today - yesterday > 0
      ? '+'
      : ''
    : '';

  return (
    <>
      {insideColons ? '(' : ''}
      <span className="bold">
        {prefix}
        {noChanges === true ? (
          today - yesterday === 0 ? (
            'ni sprememb'
          ) : (
            <Separator number={deltaCalculation} />
          )
        ) : (
          <Separator number={deltaCalculation} />
        )}
      </span>
      {insideColons ? ')' : ''}
    </>
  );
};
export default Calculate;
