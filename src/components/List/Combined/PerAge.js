import React from 'react';

import { Row, Brackets } from '../../shared/ui/New';
import { formatNumber } from '../../../utils/createLocaleNumberFormat';

function PerAge({ check_third_age, title, todayPerAge, yesterdayPerAge }) {
  const deltas = [];

  // TODO move logic to Combined, use map, make it better
  for (let i = 0; i < 10; i++) {
    const { ageFrom, ageTo } = todayPerAge[i];
    const ageRange = `${ageFrom}${ageTo ? `-${ageTo}` : '+'}`;
    const key = `${i}_${ageRange}`;
    const today = todayPerAge[i].allToDate;
    const yesterday = yesterdayPerAge[i].allToDate;

    const delta = today - yesterday;
    const _delta = (
      <span key={key}>
        {' '}
        {ageRange}{' '}
        <span className="bold">
          <Brackets>{formatNumber(delta)}</Brackets>
        </span>
        {i !== 9 ? ',' : ''}
      </span>
    );
    deltas.push(_delta);
  }

  return (
    <span className={check_third_age}>
      <Row>
        {title}: {deltas}
      </Row>
    </span>
  );
}

export default PerAge;
