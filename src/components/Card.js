import React, { useState, useRef, useContext, useEffect } from 'react';

import './Card.css';

import { formatRelative } from 'date-fns';
import { sl } from 'date-fns/locale';

import sledilnikLogo from '../assets/svg/sledilnik-logo.svg';
import copyIcon from '../assets/svg/copy.svg';

import ToClipboard from './shared/ToClipboard';
import TweetCount from './shared/TweetCount';
import TextWithTooltip from './TextWithTooltip';

import { SocialContext } from './../context/SocialContext';

const removeConsecutiveNewLines = text => {
  const step1 = text.replace(/(\r\n|\r|\n){2,}/g, '\n');
  return step1.slice(-1) === '\n' ? step1.slice(0, -1) : step1;
};

const Card = React.forwardRef(
  ({ id, open, summary, footer, popout, ...props }, ref) => {
    return (
      <details
        ref={ref}
        id={id}
        className="Card"
        open={open}
        onClick={props.onClick}
      >
        {summary}
        {props.children}
        {footer}
        {popout}
      </details>
    );
  }
);

const getTimestamp = dates => {
  const MILLISECONDS = 1000;
  const latestDate =
    dates && [...Object.entries(dates)].sort((a, b) => a[1] - b[1]).pop();
  const relativeDate =
    latestDate[1] !== null &&
    formatRelative(new Date(latestDate[1] * MILLISECONDS), new Date(), {
      locale: sl,
    });
  const timestampPath = `/${latestDate[0]}`;
  return { relativeDate, path: timestampPath };
};

function withCardHOC(Component) {
  const WithCard = ({
    title,
    dates,
    open = false,
    noCount = true,
    ...props
  }) => {
    const { postRef } = props;
    const detailsRef = useRef();
    const toClipboardButtonRef = useRef();

    const [showCharCount, setShowCharCount] = useState(null);
    const [clipboard, setClipboard] = useState('');
    const [showPopOut, setShowPopOut] = useState(false);
    const { social } = useContext(SocialContext);

    const isOpen = detailsRef?.current?.open;

    useEffect(() => {
      setShowCharCount(social === 'TW' && isOpen && !noCount);
    }, [social, isOpen, noCount]);

    // sets correct twitter char count
    useEffect(() => {
      const text = postRef.current.innerText;
      setClipboard(removeConsecutiveNewLines(text));
    }, [postRef, social, showCharCount]);

    const openPopOutHandler = () => {
      const article = postRef.current;
      detailsRef.current.open = true;
      const details = article.getElementsByTagName('details');
      [...details].forEach(item => {
        item.open = true;
      });

      setClipboard(removeConsecutiveNewLines(article.innerText));
      setShowPopOut(true);
    };

    const onDetailsClick = event => {
      const { target } = event;
      const { current: copyButton } = toClipboardButtonRef;
      const { current: details } = detailsRef;

      console.log({ open: target.dataset.open, target });

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
      setShowCharCount(social === 'TW' && details.open && !noCount);
    };

    const cardTitle = <h2 data-open="open">{title}</h2>;

    const cardId = `card-${title.toLowerCase()}`;
    const copyId = `copy-${cardId}`;

    const counter = showCharCount && (
      <TweetCount key={cardId + '-counter'} text={clipboard} />
    );
    const buttons = [
      counter,
      <img
        key={`${cardId}-${copyId}`}
        id={copyId}
        ref={toClipboardButtonRef}
        className="copy-icon"
        src={copyIcon}
        width={16}
        height={16}
        onClick={openPopOutHandler}
        alt="copy icon"
      />,
    ];

    const { relativeDate, path } = getTimestamp(dates);
    const timestamp = relativeDate && (
      <TextWithTooltip
        text={relativeDate}
        tooltipText={path}
        data-open="open"
      />
    );

    const summaryId = 'summary-' + cardId;
    const summary = (
      <summary id={summaryId} data-open="open">
        <div className="summary-row" data-open="open">
          {cardTitle}
          {buttons}
        </div>
        <div className="summary-row " data-open="open">
          {timestamp}
        </div>
      </summary>
    );

    const footer = (
      <img
        src={sledilnikLogo}
        alt="sledilnik logo"
        width="96"
        height="48"
        style={{ display: 'block', margin: '0 auto' }}
      />
    );

    const popout = (
      <ToClipboard
        open={showPopOut}
        defaultValue={clipboard}
        clear={() => setClipboard('')}
        close={() => setShowPopOut(false)}
      />
    );

    const cardProps = {
      id: cardId,
      open,
      summary,
      footer,
      popout,
    };
    return (
      <Component
        ref={detailsRef}
        onClick={onDetailsClick}
        {...cardProps}
        {...props}
      />
    );
  };
  return WithCard;
}
export default withCardHOC(Card);
