import { NextRouter } from 'next/router';
import BlogsQuery from '../models/BlogsQuery';
import HeaderParams from '../models/HeaderParams';
import HeadParams from '../models/HeadParams';

const generateHeaderParams = (router: NextRouter): HeaderParams => {
  const { pathname } = router;

  switch (pathname) {
    case '/profile':
      return {
        title: 'Profile',
        subTitle: 'プロフィール',
        imgProps: { src: '/profile.png', alt: 'Profile' },
      };
    case '/portfolio':
      return {
        title: 'Portfolio',
        subTitle: 'ポートフォリオ',
        imgProps: { src: '/portfolio.png', alt: 'Portfolio' },
      };
    case '/blogs':
    case '/blogs/[id]':
    case '/blogs/page/[offset]':
    case '/blogs/sitemap':
    case '/blogs/search':
    case '/blogs/tags/[id]':
    case '/blogs/tags/[id]/page/[offset]':
    case '/blogs/categories/[id]/page/[offset]':
      return {
        title: 'Blogs',
        subTitle: 'ブログ一覧',
        imgProps: { src: '/blog.png', alt: 'Blogs' },
      };
    case '/contact':
    case '/contact/success':
    case '/contact/error':
      return {
        title: 'Contact',
        subTitle: 'お問い合わせ',
        imgProps: { src: '/contact.png', alt: 'Contact' },
      };
    case '/privacy':
      return {
        title: 'Privacy Policy',
        subTitle: 'プライバシーポリシー',
        imgProps: { src: '/icon.png', alt: 'プライバシーポリシー' },
      };
    case '/404':
      return {
        title: 'Error',
        subTitle: 'エラー',
        imgProps: { src: '/icon.png', alt: 'エラー' },
      };
    default: {
      return {
        title: '',
        subTitle: '',
        imgProps: { src: '/', alt: '' },
      };
    }
  }
};

const generateHeadParams = (router: NextRouter): HeadParams => {
  const { pathname } = router;

  switch (pathname) {
    case '/':
      return {
        title: 'Home',
        type: 'website',
        url: `${router.asPath}`,
      };
    case '/profile':
      return {
        title: 'profile',
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/portfolio':
      return {
        title: 'Portfolio',
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/blogs':
      return {
        title: 'Blogs',
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/blogs/search': {
      const urlQuery = router.query as BlogsQuery;

      return {
        title: `「${urlQuery.keyword ?? ''}」の検索結果`,
        type: 'article',
        url: `${router.asPath}`,
      };
    }
    case '/blogs/[id]':
    case '/blogs/page/[offset]':
    case '/blogs/tags/[id]/page[offset]':
    case '/blogs/categories/[id]/page[offset]':
      return {
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/contact':
      return {
        title: 'Contact',
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/contact/success':
      return {
        title: 'Success',
        type: 'article',
        url: `${router.asPath}`,
      };
    case '/contact/error':
    case '/404':
      return {
        title: 'Error',
        type: 'article',
        url: `${router.asPath}`,
      };
    default: {
      return {
        title: 'JI23-DEV',
        type: 'article',
        url: `${router.asPath}`,
      };
    }
  }
};

// TODO:項目が増えたらちゃんと考える
const generateBlogsUrl = (query: BlogsQuery): string | null => {
  if (query.limit && query.offset && query.tagId) {
    return `blogs?filters=tags[contains]${query.tagId}&offset=${query.offset}&limit=${query.limit}`;
  }
  if (query.limit && query.offset && query.categoryId) {
    return `blogs?filters=category[equals]${query.categoryId}&offset=${query.offset}&limit=${query.limit}`;
  }
  if (query.keyword && query.tagId) {
    return `blogs?filters=title[contains]${query.keyword}[or]content[contains]${query.keyword}[or]tags[contains]${query.tagId}`;
  }
  if (query.keyword) {
    return `blogs?q=${encodeURI(query.keyword)}`;
  }
  if (query.tagId) {
    return `blogs?filters=tags[contains]${query.tagId}`;
  }
  if (query.categoryId) {
    return `blogs?filters=tags[contains]${query.categoryId}`;
  }
  if (query.limit && query.offset) {
    return `blogs?offset=${query.offset}&limit=${query.limit}`;
  }

  return null;
};

export { generateHeaderParams, generateHeadParams, generateBlogsUrl };
