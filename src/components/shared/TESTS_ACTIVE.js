import React from 'react';
import Percentage from '../List/TESTS_ACTIVE/Percentage';
import DataRow from '../List/shared/DataRow';
import InOut from '../List/shared/InOut';
import StyledNumber from '../List/shared/StyledNumber';

function TESTS_ACTIVE({ check_first, labTests, summary }) {
  const { regular, hagt } = labTests[labTests.length - 1].data;
  const casesActive = summary.casesActive.value;
  const casesActiveIn = summary.casesActive.subValues.in;
  const casesActiveOut = summary.casesActive.subValues.out;

  const DataWithRatio = ({ numPositive, numPerformed }) => (
    <>
      <StyledNumber className="bold" number={numPositive} prefix={true} />,
      testiranih: <StyledNumber className="bold" number={numPerformed} />, delež
      pozitivnih:{' '}
      <Percentage part={numPositive} total={numPerformed}></Percentage>
      %.
    </>
  );

  const DataWithInOut = ({ number, numIn, numOut }) => {
    return (
      <>
        <StyledNumber className="bold" number={number} />{' '}
        <InOut numIn={numIn} numOut={numOut} insideColons={true} />
      </>
    );
  };

  return (
    <div className={check_first}>
      <DataRow title={'PCR'}>
        <DataWithRatio
          numPositive={regular.positive.today}
          numPerformed={regular.performed.today}
        />
      </DataRow>
      <DataRow title={'HAT'}>
        <DataWithRatio
          numPositive={hagt.positive.today}
          numPerformed={hagt.performed.today}
        />
      </DataRow>
      <DataRow title={'Aktivni primeri'}>
        <DataWithInOut
          number={casesActive}
          numIn={casesActiveIn}
          numOut={casesActiveOut}
        />
        .
      </DataRow>
    </div>
  );
}

export default TESTS_ACTIVE;
