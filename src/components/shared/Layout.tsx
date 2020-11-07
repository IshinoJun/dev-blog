import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import HeadProps from '../../models/HeadProps';
import JI23Head from './JI23Head';
import style from './Layout.module.scss';

interface Props {
  children: React.ReactNode;
  headProps: HeadProps;
}

const Layout: React.FC<Props> = (props: Props) => {
  const { children, headProps } = props;
  const router = useRouter();
  const isTop = router.pathname === '/';

  return (
    <>
      <JI23Head {...headProps} />
      <main className="wrapper">
        {!isTop ? (
          <Header />
        ) : (
          <header className={style.logo}>
            <Link href="/" as="/">
              <a>
                <img src="/logo.png" alt="ロゴ画像" />
              </a>
            </Link>
          </header>
        )}
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;
