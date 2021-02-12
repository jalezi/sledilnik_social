import React, { useContext } from 'react';
import PresentData from './PresentData';
import { summaryDict } from '../dicts/DataTranslateDict';
import getTranslatedData from '../utils/getTranslatedData';
import { DataContext } from '../context/DataContext';

// path summary
const DataTranslateDict = summaryDict.vaccinationSummary;

function Vaccination({ data, ...props }) {
  const translatedData = getTranslatedData(DataTranslateDict, data);

  return <PresentData data={translatedData} props={props} />;
}

function withVaccination_HOC(Component) {
  return ({ ...props }) => {
    const { summary: hook } = useContext(DataContext);

    if (hook.isLoading) {
      return 'Loading....';
    }

    if (hook.data === null) {
      return 'Null';
    }

    const { vaccinationSummary } = hook.data;

    const newProps = { ...props, data: vaccinationSummary };

    return <Component {...newProps} />;
  };
}
export default withVaccination_HOC(Vaccination);
