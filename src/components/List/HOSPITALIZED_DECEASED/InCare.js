import React from 'react';
import { Row, Brackets } from '../../shared/ui/New';

function InCare({ text, careNum, careIn, careOut }) {
  const { title } = text;
  const titleText = Object.values(title).join('');

  const isUndefined = value => value === undefined;
  const noData =
    isUndefined(careNum) || isUndefined(careIn) || isUndefined(careOut);

  // -> Negovalne bolnišnice: 103 (+3, -1)
  return (
    <Row className={noData && 'red'}>
      {titleText}
      <span className="bold">{careNum}</span>
      <span className="bold">
        <Brackets>
          {careIn}, {careOut}
        </Brackets>
      </span>
    </Row>
  );
}

export default InCare;
