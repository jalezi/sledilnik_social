import React from 'react';
import Separator from '../List/shared/Separator';
import Translate from '../List/shared/Translate';
import Delta from '../List/shared/Delta';
import DataRow from '../List/shared/DataRow';
import InOut from '../List/shared/InOut';
import DataTranslate from '../List/shared/DataTranslate';

function HOSPITALIZED_DECEASED({ check_second, stats, patients }) {
  return (
    <div className={check_second}>
      <DataRow title={'Hospitalizirani'}>
        <DataTranslate
          number={stats[stats.length - 1].statePerTreatment.inHospital}
          text={'oseba'}
        />
        <InOut
          numIn={patients[patients.length - 1].total.inHospital.in}
          numOut={patients[patients.length - 1].total.inHospital.out}
          insideColons={true}
        />
        , v EIT{' '}
        <DataTranslate
          number={stats[stats.length - 1].statePerTreatment.inICU}
          text={'oseba'}
        />
        <Delta
          today={stats[stats.length - 1].statePerTreatment.inICU}
          yesterday={stats[stats.length - 2].statePerTreatment.inICU}
          insideColons={true}
          getPrefix={true}
          noChanges={true}
        ></Delta>
        .
      </DataRow>
      <DataRow title={'Na respiratorju (intubirani) se'} noColon={true}>
        <Translate
          text={'zdravi'}
          number={stats[stats.length - 1].statePerTreatment.critical}
        ></Translate>{' '}
        <DataTranslate
          number={stats[stats.length - 1].statePerTreatment.critical}
          text={'oseba'}
        />{' '}
        <Delta
          today={stats[stats.length - 1].statePerTreatment.critical}
          yesterday={stats[stats.length - 2].statePerTreatment.critical}
          insideColons={true}
          getPrefix={true}
          noChanges={true}
        ></Delta>
        .
      </DataRow>
      <DataRow title={'Preminuli'}>
        {stats[stats.length - 1].statePerTreatment.deceased > 0 ? '+' : ''}
        <DataTranslate
          number={stats[stats.length - 1].statePerTreatment.deceased}
          text={'oseba'}
        />
        , skupaj:{' '}
        <span className="bold">
          <Separator
            number={stats[stats.length - 1].statePerTreatment.deceasedToDate}
          />
        </span>
        .
      </DataRow>
    </div>
  );
}

export default HOSPITALIZED_DECEASED;
