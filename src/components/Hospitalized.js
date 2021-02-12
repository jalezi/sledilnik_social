import React, { useContext } from 'react';
import PresentData from './PresentData';
import { patients } from '../dicts/dataDict';
import getTranslatedData from '../utils/getTranslatedData';
import { DataContext } from '../context/DataContext';

// path patients
const dataDict = patients.hospitalized;

function Hospitalized({ data, ...props }) {
  const translatedData = getTranslatedData(dataDict, data);

  return <PresentData data={translatedData} props={props} />;
}

function withHospitalizedHOC(Component) {
  return ({ ...props }) => {
    const { patients } = useContext(DataContext);

    if (patients.isLoading) {
      return 'Loading....';
    }

    if (patients.data === null) {
      return 'Null';
    }

    const sortedData = [...patients.data].sort(
      (a, b) => b.dayFromStart - a.dayFromStart
    );

    const newProps = { ...props, data: sortedData };

    return <Component {...newProps} />;
  };
}
export default withHospitalizedHOC(Hospitalized);
