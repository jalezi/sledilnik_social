import React, { useContext } from 'react';
import PresentData from './PresentData';
import { summaryDict } from '../dicts/dataDict';
import getTranslatedData from '../utils/getTranslatedData';
import { DataContext } from '../context/DataContext';

// path summary
const dataDict = summaryDict.testsTodayHAT;

function HAT({ data, ...props }) {
  const translatedData = getTranslatedData(dataDict, data);

  return <PresentData data={translatedData} props={props} />;
}

function withHAT_HOC(Component) {
  return ({ ...props }) => {
    const { summary: hook } = useContext(DataContext);

    if (hook.isLoading) {
      return 'Loading....';
    }

    if (hook.data === null) {
      return 'Null';
    }

    const { testsTodayHAT } = hook.data;

    const newProps = { ...props, data: testsTodayHAT };

    return <Component {...newProps} />;
  };
}
export default withHAT_HOC(HAT);
