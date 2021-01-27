import React, { useState } from 'react';

import './List.css';

import Intro from './shared/ui/Intro';
import Outro from './shared/ui/Outro';
import TESTS_ACTIVE from './List/TESTS_ACTIVE';
import HOSPITALIZED_DECEASED from './List/HOSPITALIZED_DECEASED';
import Combined from './List/Combined';

import { formatToLocaleDateString } from '../utils/dates';

const List = ({
  statsHook,
  patientsHook,
  municipalitiesHook,
  hospitalsListHook,
  labTestsHook,
  summaryHook,
}) => {
  const [length, setLength] = useState(0);
  const introTodayDate = formatToLocaleDateString(new Date(), 'd.M.yyyy');

  const clickHandler = () => {
    const copyText = document.getElementById('copy');
    copyText.value = copyText.value.replace(/(\r\n|\r|\n){2,}/g, '\n');

    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand('copy');
  };

  const changeHandler = event => {
    setLength(event.target.value.length);
  };

  return (
    <div className="List">
      <div style={{ display: 'block', fontSize: '0.9em' }}>
        <label htmlFor="copy" id="copy-label">
          Odstrani odvečne vrstice, označi in prenese v odložišče.
        </label>{' '}
        <p style={{ margin: '0.5em 0' }}>Število znakov: {length}</p>
        <div className="textwrapper">
          <textarea cols="50" rows="10" id="copy" onChange={changeHandler} />
        </div>
        <div className="text-area-btn-container">
          <button className="btn" onClick={clickHandler}>
            V odložišče
          </button>
          <a
            href="https://twitter.com/intent/tweet?button_hashtag=COVID19&ref_src=twsrc%5Etfw"
            className="twitter-hashtag-button"
            data-show-count="false"
          >
            Tweet #COVID19
          </a>
        </div>
      </div>
      <section className="post">
        <Intro post={1} introTodayDate={introTodayDate} />
        <TESTS_ACTIVE labTestsHook={labTestsHook} summaryHook={summaryHook} />
        <Outro />
      </section>
      <section className="post">
        <Intro post={2} introTodayDate={introTodayDate} />
        <HOSPITALIZED_DECEASED patientsHook={patientsHook} />
        <Outro />
      </section>
      <section className="post">
        <Intro post={3} introTodayDate={introTodayDate} />
        <Combined
          statsHook={statsHook}
          summaryHook={summaryHook}
          patientsHook={patientsHook}
          labTestsHook={labTestsHook}
          municipalitiesHook={municipalitiesHook}
          hospitalsListHook={hospitalsListHook}
        />
        <Outro />
      </section>
    </div>
  );
};

function withListHOC(Component) {
  return ({ ...props }) => {
    return <Component {...props} />;
  };
}

export default withListHOC(List);
