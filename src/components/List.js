import React from 'react';

import format from 'date-fns/format';
import { sl } from 'date-fns/locale';
import differenceInDays from 'date-fns/differenceInDays';

import Intro from './shared/ui/Intro';
import Outro from './shared/ui/Outro';
import TESTS_ACTIVE from './List/TESTS_ACTIVE';
import HOSPITALIZED_DECEASED from './List/HOSPITALIZED_DECEASED';
import Combined from './List/Combined';

import './List.css';
import Modal from './shared/Modal';
import Backdrop from './shared/Backdrop';
import Loader from './shared/Loader';

// API paths: lab-tests, summary
function getTestsActiveData(labTests, summary) {
  const labTestsData = labTests.slice(-1).pop().data;
  const { casesActive: active } = summary;

  const { regular, hagt } = labTestsData;
  const casesActive = active.value;
  const casesActiveIn = active.subValues.in;
  const casesActiveOut = active.subValues.out;

  const cases = { casesActive, casesActiveIn, casesActiveOut: -casesActiveOut };

  const { today: regToday } = regular.positive;
  const { today: regPerformed } = regular.performed;
  const { today: hagtToday } = hagt.positive;
  const { today: hagtPerformed } = hagt.performed;

  const calcFraction = (numerator, denominator) => numerator / denominator;

  const regFraction = calcFraction(regToday, regPerformed);
  const hagtFraction = calcFraction(hagtToday, hagtPerformed);

  const regTests = { regToday, regPerformed, regFraction };
  const hagtTests = { hagtToday, hagtPerformed, hagtFraction };

  return {
    cases,
    regTests,
    hagtTests,
  };
}
// API paths: stats, patients
function getHospitalizedDeceasedData(patients) {
  const patientsToday = patients.slice(-1).pop();
  const patientsYesterday = patients.slice(-2, -1).pop();

  // <Hospitalized/>
  const {
    today: hospNum,
    in: hospIn,
    out: hospOut,
  } = patientsToday.total.inHospital;
  const todayICU = patientsToday.total.icu.today;
  const yesterdayICU = patientsYesterday.total.icu.today;
  const icuDelta = todayICU - yesterdayICU;
  const hospitalized = {
    hospNum,
    hospIn,
    hospOut: -hospOut,
    icuNum: todayICU,
    icuDelta,
  };

  // <OnRespiratory/>
  const todayCritical = patientsToday.total.critical.today;
  const yesterdayCritical = patientsYesterday.total.critical.today;
  const respiratoryDelta = todayCritical - yesterdayCritical;

  const todayNiv = patientsToday.total.niv.today;
  const yesterdayNiv = patientsYesterday.total.niv.today;
  const nivDelta = todayNiv - yesterdayNiv;

  const respiratoryTotal = todayNiv + todayCritical;
  const onRespiratory = {
    respiratoryTotal,
    todayCritical,
    respiratoryDelta,
    todayNiv,
    nivDelta,
  };

  // <InCare/>
  const { today: careNum, in: careIn, out: careOut } = patientsToday.total.care;
  const inCare = { careNum, careIn, careOut: -careOut };

  // <Deceased/>
  // TODO rename deceased properties -> use today and toDate
  const { today: dead, toDate: deceasedToDate } = patientsToday.total.deceased;
  const deceased = { deceased: dead, deceasedToDate };

  return {
    hospitalized,
    onRespiratory,
    inCare,
    deceased,
  };
}

// API paths: stats
function getCombinedData(stats, hospitalsList, patients, municipalities) {
  const statsYesterday = stats.slice(-2, -1).pop();
  const statsTwoDaysAgo = stats.slice(-3, -2).pop();
  const todayPerAge = statsYesterday.statePerAgeToDate;
  const yesterdayPerAge = statsTwoDaysAgo.statePerAgeToDate;

  const vaccinationToDate = statsYesterday.vaccination.administered.toDate;

  const confirmedToDate = statsYesterday.cases.confirmedToDate;

  // prepare data fot Combined
  // {code: 'xxx', name: 'yyy', uri: 'zzz} -> [['xxx', 'zzz]] [[<code>,<name>]]
  const hospitalsDict = prepareHospitalsDict(hospitalsList);

  // prepare perHospitalChanges
  // use data fromAPI paths: stats, patients, municipalities
  const perHospitalChanges = getPerHospitalChanges(patients);
  const perHospitalChangesWithLongName = findAndPushLongHospitalName(
    perHospitalChanges,
    hospitalsDict
  );

  return {
    todayPerAge,
    yesterdayPerAge,
    vaccinationToDate,
    confirmedToDate,
    perHospitalChanges: perHospitalChangesWithLongName,
    patients,
    municipalities,
  };
}

const List = ({
  stats,
  municipalities,
  patients,
  labTests,
  summary,
  hospitalsList,
}) => {
  const css = getChecks({ stats, municipalities, patients, summary, labTests });

  const introTodayDate = formatToLocaleDateString(new Date(), 'd.M.yyyy');

  // use data from API paths: summary, lab-tests
  const testsActive = getTestsActiveData(labTests, summary);

  // use data from API paths: patients
  const hospitalizedDeceased = getHospitalizedDeceasedData(patients);

  // use data from Api paths: stats, hosptalis-list, patients, municipalities
  const combined = getCombinedData(
    stats,
    hospitalsList,
    patients,
    municipalities
  );

  return (
    <div className="List">
      <section className="tweet">
        <Intro post={1} introTodayDate={introTodayDate} />
        <TESTS_ACTIVE
          check_summary={css.check_summary}
          check_lab_tests={css.check_lab_tests}
          cases={testsActive.cases}
          regTests={testsActive.regTests}
          hagtTests={testsActive.hagtTests}
        />
        <Outro />
      </section>
      <section className="tweet">
        <Intro post={2} introTodayDate={introTodayDate} />
        <HOSPITALIZED_DECEASED
          check_patients={css.check_patients}
          hospitalized={hospitalizedDeceased.hospitalized}
          onRespiratory={hospitalizedDeceased.onRespiratory}
          inCare={hospitalizedDeceased.inCare}
          deceased={hospitalizedDeceased.deceased}
          stats={stats}
          patients={patients}
        />
        <Outro />
      </section>
      <section className="tweet">
        <Intro post={3} introTodayDate={introTodayDate} />
        <Combined
          testsActive={testsActive}
          hospitalizedDeceased={hospitalizedDeceased}
          combined={combined}
          css={css}
        />
        <Outro />
      </section>
    </div>
  );
};

function withListLoading(Component) {
  return function WihLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return (
      <Modal>
        <Backdrop className="backdrop-loader">
          <Loader />
        </Backdrop>
      </Modal>
    );
  };
}

export default withListLoading(List);

const isUndefined = val => val === undefined;

// prepare hospitalsDict
function prepareHospitalsDict(hospitalsList) {
  return hospitalsList.map(hospital => [hospital.code, hospital.name]);
}

// prepare perHospitalChanges
// -> [["ukclj", {care: {...}, critical: {..}, deceased: {...},deceasedCare: {...}, icu: {...}, inHospital: {...}, niv: {...} }],...]
// properties of interest icu & inHospital
function getPerHospitalChanges(patients) {
  const patientsData = patients.slice(-1).pop();
  const patientsDataIsNotUndefined = !isUndefined(patientsData);
  return patientsDataIsNotUndefined && Object.entries(patientsData.facilities);
}

// -> [["ukclj", {...}, "UKC Ljubljana"],... ]
function findAndPushLongHospitalName(perHospitalChanges, hospitalsDict) {
  return perHospitalChanges.map(hospital => {
    const hospitalLongName = hospitalsDict.filter(
      item => hospital[0] === item[0]
    )[0][1];
    return [...hospital, hospitalLongName];
  });
}

export function formatToLocaleDateString(
  dateAsText = '',
  formatStr = 'd.M.yyyy',
  options = { locale: sl }
) {
  const date = new Date(dateAsText);
  return format(date, formatStr, options);
}

// date received is part of an object with properties: year, month, day
export function getDate(obj = {}) {
  let { year, month, day } = obj;
  return new Date(year, month - 1, day);
}

// extract last item in array form API data
export function getLastUpdatedData({
  stats,
  municipalities,
  patients,
  labTests,
}) {
  return {
    patientsData: patients.slice(-1).pop(),
    statsData: stats.slice(-1).pop(),
    municipalitiesData: municipalities.slice(-1).pop(),
    labTestsData: labTests.slice(-1).pop(),
  };
}

/**
 * paint red if data is not updated for the current day;
 * variables <somethin>Check are used as className
 */
export function getChecks({
  stats,
  municipalities,
  patients,
  summary,
  labTests,
}) {
  // data
  const lastUpdatedData = getLastUpdatedData({
    stats,
    patients,
    municipalities,
    labTests,
  });

  // dates
  const patientsDate = getDate(lastUpdatedData.patientsData);
  const statsDate = getDate(lastUpdatedData.statsData);
  const municipalitiesDate = getDate(lastUpdatedData.municipalitiesData);
  const labTestsDate = getDate(lastUpdatedData.labTestsData);
  const summaryDate = getDate(summary.casesActive); // before labTests

  // checks
  const patientsCheck = differenceInDays(new Date(), patientsDate) > 0;

  const isPerAgeDataUndefined = isUndefined(
    stats.slice(-2, -1).pop().statePerAgeToDate[0].allToDate
  );
  const statsCheck =
    isPerAgeDataUndefined || differenceInDays(new Date(), statsDate) > 0;

  const municipalitiesCheck =
    differenceInDays(new Date(), municipalitiesDate) > 1;

  const labTestsCheck = differenceInDays(new Date(), labTestsDate) > 1;

  const summaryCheck = differenceInDays(new Date(), summaryDate) > 1;

  return {
    check_summary: summaryCheck ? 'red' : '',
    check_patients: patientsCheck ? 'red' : '',
    check_stats: statsCheck ? 'red' : '',
    check_municipalities: municipalitiesCheck ? 'red' : '',
    check_lab_tests: labTestsCheck ? 'red' : '',
  };
}
