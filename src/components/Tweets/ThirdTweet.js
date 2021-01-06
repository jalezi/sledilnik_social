import React from 'react';
import Arrow from '../Arrow';
import Separator from '../Separator';
import Translate from '../Translate';
import PerAgeLine from '../PerAgeLine';
import MunicipalitiesLines from '../MunicipalitiesLines';

function ThirdTweet({
  check_second,
  check_third_age,
  check_third_mun,
  stats,
  patients,
  municipalities,
  perHospitalChanges,
}) {
  const todayPerAge = stats[stats.length - 2].statePerAgeToDate;
  const yesterdayPerAge = stats[stats.length - 3].statePerAgeToDate;

  return (
    <div>
      <PerAgeLine
        check_third_age={check_third_age}
        todayPerAge={todayPerAge}
        yesterdayPerAge={yesterdayPerAge}
      />
      <span className={check_second}>
        <p className="text">
          <Arrow /> Stanje po bolnišnicah:
        </p>
        <ul>
          {patients[patients.length - 1] === undefined
            ? 'NI PODATKOV'
            : perHospitalChanges
                .sort(
                  (a, b) =>
                    (b[1].inHospital.today || 0) - (a[1].inHospital.today || 0)
                )
                .map(hosp => {
                  return hosp[1].inHospital.today === undefined ? (
                    ''
                  ) : (
                    <li key={hosp[0]}>
                      <span>
                        <span className="bold">{hosp[2]}</span>:{' '}
                        <span className="bold">
                          <Separator number={hosp[1].inHospital.today} />
                        </span>{' '}
                        <Translate
                          text={'oseba'}
                          number={hosp[1].inHospital.today}
                        ></Translate>{' '}
                        (
                        <span className="bold">
                          +<Separator number={hosp[1].inHospital.in} /> -
                          <Separator number={hosp[1].inHospital.out} />
                        </span>
                        ), EIT{' '}
                        <span className="bold">
                          <Separator number={hosp[1].icu.today} />
                        </span>{' '}
                        <Translate
                          text={'oseba'}
                          number={hosp[1].icu.today}
                        ></Translate>{' '}
                        (
                        <span className="bold">
                          +
                          <Separator number={hosp[1].icu.in} /> -
                          <Separator number={hosp[1].icu.out} />
                        </span>
                        ).
                      </span>
                      <br />
                    </li>
                  );
                })}
        </ul>
      </span>

      <MunicipalitiesLines
        check_third_mun={check_third_mun}
        municipalities={municipalities}
      />
    </div>
  );
}

export default ThirdTweet;
