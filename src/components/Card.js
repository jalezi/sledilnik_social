import React, { useState, useEffect, useRef } from 'react';

import './Card.css';

import { formatRelative } from 'date-fns';
import { sl } from 'date-fns/locale';

import sledilnikLogo from '../assets/sledilnik-logo.svg';
import copyIcon from '../assets/svg/copy.svg';
import PopOut from './shared/PopOut';

function Card({ id, summary, dates = {}, children, open = false }) {
  const detailsRef = useRef();
  const toClipboardButtonRef = useRef();

  const [clipboard, setClipboard] = useState(null);
  const [showPopOut, setShowPopOut] = useState(false);

  useEffect(() => {
    const close = e => {
      if (e.keyCode === 27) {
        setShowPopOut(false);
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const sortedDates = [...Object.values(dates)].sort((a, b) => b - a);

  const noDates = Object.values(dates).every(item => item === null);
  const relativeDate = noDates ? (
    <span style={{ opacity: 0, marginLeft: '24px' }}>ni podatka</span>
  ) : (
    formatRelative(new Date(sortedDates[0] * 1000), new Date(), {
      locale: sl,
    })
  );

  const copyHandler = event => {
    const buttonId = event.target.id;
    const postId = buttonId.replace('copy-card', 'post');
    const article = document.getElementById(postId);
    detailsRef.current.open = true;
    const details = article.getElementsByTagName('details');
    [...details].forEach(item => {
      item.open = true;
    });
    let text = article.innerText.replace(/(\r\n|\r|\n){2,}/g, '\n');
    text = text.slice(-1) === '\n' ? text.slice(0, -1) : text;
    setClipboard(text);
    setShowPopOut(true);
  };

  const selectAndCopy = textarea => {
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    document.execCommand('copy');
  };

  const closeHandler = async () => {
    const textarea = document.getElementById('textarea-copy');
    textarea.value = '';
    navigator.clipboard && (await navigator.clipboard.writeText(''));
    !navigator.clipboard && selectAndCopy(textarea);
    setClipboard('');
    setShowPopOut(false);
  };

  const toClipboardHandler = async () => {
    const textarea = document.getElementById('textarea-copy');
    navigator.clipboard &&
      (await navigator.clipboard.writeText(textarea.value));
    !navigator.clipboard && selectAndCopy(textarea);
    setShowPopOut(false);
  };

  const onDetailsClick = event => {
    const { target } = event;
    const { current: copyButton } = toClipboardButtonRef;
    const { current: details } = detailsRef;

    if (target.dataset.open !== 'open' && target.id !== copyButton.id) {
      return;
    }

    event.preventDefault();
    if (target.id === copyButton.id) {
      details.open = true;
      return;
    }

    details.open = !details.open;
    details.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  };

  const latestDate =
    dates && [...Object.values(dates)].sort((a, b) => a - b).pop();

  const relativeDate =
    latestDate !== null &&
    formatRelative(new Date(latestDate * 1000), new Date(), {
      locale: sl,
    });

  const cardId = 'card-' + id;
  const summaryId = 'summary-' + cardId;
  const buttonId = 'copy-' + cardId;

  return (
    <details
      ref={detailsRef}
      id={cardId}
      className="Card"
      open={open}
      onClick={onDetailsClick}
    >
      <summary id={summaryId} data-open="open">
        <div className="summary-container" data-open="open">
          <h2 data-open="open">{summary}</h2>
          <div data-open="open" className="summary-date">
            Osveženo:{' '}
            {relativeDate ? (
              relativeDate
            ) : (
              <span style={{ marginLeft: '26px' }}>...loading</span>
            )}
          </div>
          <img
            id={buttonId}
            ref={toClipboardButtonRef}
            className="copy-icon"
            src={copyIcon}
            width={16}
            height={16}
            onClick={copyHandler}
            alt="copy icon"
          />
        </div>
      </summary>
      {children}
      <img
        src={sledilnikLogo}
        alt="sledilnik logo"
        width="96"
        height="48"
        style={{ display: 'block', margin: '0 auto' }}
      />
      <PopOut open={showPopOut}>
        <div className="popout-container">
          <div className="textarea-container">
            <textarea
              id="textarea-copy"
              readOnly={true}
              rows="10"
              defaultValue={clipboard}
              style={{ width: ' 100%', resize: 'none' }}
            />
          </div>
          <div className="button-container">
            <button onClick={toClipboardHandler}>V odložišče</button>
          </div>
        </div>
        <div className="close" onClick={closeHandler}>
          <div className="line line-1"></div>
          <div className="line line-2"></div>
        </div>
      </PopOut>
    </details>
  );
}

export default Card;
