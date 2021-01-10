import React from 'react';
import Translate from '../List/shared/Translate';
import Delta from '../List/shared/Delta';
import DataRow from '../List/shared/DataRow';
import InOut from '../List/shared/InOut';
import DataTranslate from '../List/shared/DataTranslate';
import StyledNumber from '../List/shared/StyledNumber';

function HOSPITALIZED_DECEASED({ check_second, stats, patients }) {
  const hospNum = stats[stats.length - 1].statePerTreatment.inHospital;
  const hospIn = patients[patients.length - 1].total.inHospital.in;
  const hospOut = patients[patients.length - 1].total.inHospital.out;
  const icuNum = stats[stats.length - 1].statePerTreatment.inICU;
  const todayICU = stats[stats.length - 1].statePerTreatment.inICU;
  const yesterdayICU = stats[stats.length - 2].statePerTreatment.inICU;

  const todayCritical = stats[stats.length - 1].statePerTreatment.critical;
  const yesterdayCritical = stats[stats.length - 2].statePerTreatment.critical;

  const { deceased, deceasedToDate } = stats[
    stats.length - 1
  ].statePerTreatment;

  function Hospitalized({
    title,
    subtitle,
    totalNum,
    inOut = [0, 0],
    icuNum,
    icuDelta = [0, 0],
  }) {
    return (
      <DataRow title={title}>
        <DataTranslate number={totalNum} text={'oseba'} />
        <InOut numIn={inOut[0]} numOut={inOut[1]} insideColons={true} />,{' '}
        {subtitle} <DataTranslate number={icuNum} text={'oseba'} />
        <Delta
          today={icuDelta[0]}
          yesterday={icuDelta[1]}
          insideColons={true}
          getPrefix={true}
          noChanges={true}
        ></Delta>
        .
      </DataRow>
    );
  }

  function OnRespiratory({ today, yesterday }) {
    return (
      // TODO DataRow if noColon true add space instead
      <DataRow title={'Na respiratorju (intubirani) se'} noColon={true}>
        {' '}
        <Translate text={'zdravi'} number={today}></Translate>{' '}
        <DataTranslate number={today} text={'oseba'} />{' '}
        <Delta
          today={today}
          yesterday={yesterday}
          insideColons={true}
          getPrefix={true}
          noChanges={true}
        ></Delta>
        .
      </DataRow>
    );
  }

  function Deceased({ deceased, deceasedToDate }) {
    const plusOrEmpty = deceased > 0 ? '+' : '';
    return (
      <DataRow title={'Preminuli'}>
        {plusOrEmpty}
        <DataTranslate number={deceased} text={'oseba'} />, skupaj:{' '}
        <StyledNumber className="bold" number={deceasedToDate} />.
      </DataRow>
    );
  }

  return (
    <div className={check_second}>
      <Hospitalized
        title={'Hospitalizirani'}
        subtitle={'v EIT'}
        totalNum={hospNum}
        inOut={[hospIn, hospOut]}
        icuNum={icuNum}
        icuDelta={[todayICU, yesterdayICU]}
      />
      <OnRespiratory today={todayCritical} yesterday={yesterdayCritical} />
      <Deceased deceased={deceased} deceasedToDate={deceasedToDate} />
    </div>
  );
}

export default HOSPITALIZED_DECEASED;
