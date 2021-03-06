import React from 'react';
import { NextPage } from 'next';
import { Button } from '@material-ui/core';
import Link from 'next/link';
import style from './index.module.scss';

import useMedia from '../../../hooks/useMedia';
import { pagesPath } from '../../../utils/$path';

const SuccessIndex: NextPage = () => {
  const isTab = useMedia('tab');

  return (
    <section className="padding-block border-bottom">
      <div className="container">
        <div className={style.contact}>
          <div>
            {isTab ? (
              <h2>お問い合わせありがとうございます</h2>
            ) : (
              <h2>
                お問い合わせ
                <br />
                ありがとうございます
              </h2>
            )}
            <p>ご記入頂いた情報は無事に送信されました</p>
            <p>数日中にご返信致しますので少々お待ちください</p>
          </div>
          <Button
            type="button"
            variant="contained"
            className={style.back}
            aria-label="ホームに戻る"
          >
            <Link href={pagesPath.$url()}>
              <a>ホームに戻る</a>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessIndex;
