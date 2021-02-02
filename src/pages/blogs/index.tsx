import React, { useCallback, useContext } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import style from './index.module.scss';

import DevCMS from '../api/DevCMS';
import Blog from '../../models/Blog';
import ArrayList from '../../models/Array';
import { isPreviewData } from '../../utils/TypeGuardUtils';
import Blogs from '../../components/shared/Blogs';
import BlogSideContents from '../../components/shared/BlogSideContents';
import createOgp from '../../utils/server/ogpUtils';
import BlogsQuery from '../../models/BlogsQuery';
import Category from '../../models/Category';

import SearchContext from '../../context/searchContext';

interface Props {
  blogs: ArrayList<Blog>;
  categories: ArrayList<Category>;
}

const BlogsPage: NextPage<Props> = (props: Props) => {
  const { blogs, categories } = props;
  const { search, setSearch } = useContext(SearchContext);
  const router = useRouter();

  const handleClickSearchButton = useCallback(() => {
    void router.push(`/blogs/search/?keyword=${search}`);
  }, [search, router]);

  const handleKeyDownSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        void router.push(`/blogs/search/?keyword=${search}`);
      }
    },
    [search, router],
  );

  return (
    <div
      className={`${String(
        style.blogsContainer,
      )} container padding-block border-bottom`}
    >
      <main className={style.mainWrapper}>
        <Blogs blogs={blogs} showPagination />
      </main>
      <div className={style.sideWrapper}>
        <BlogSideContents
          keyword={search}
          categories={categories}
          onClickSearchButton={handleClickSearchButton}
          onKeyDownSearch={handleKeyDownSearch}
          setKeyword={setSearch}
        />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  preview,
  previewData,
}): Promise<{
  props: Props;
}> => {
  const query: BlogsQuery = { offset: '0', limit: '3' };
  const devCMS = new DevCMS();
  const blogs = await devCMS.getBlogs(query);
  const categories = await devCMS.getCategories();

  if (process.env.BUILD_OGP === 'true') {
    blogs.contents.forEach((blog) => {
      void createOgp(blog);
    });
  }

  // プレビュー時は draft のコンテンツを追加
  if (preview && isPreviewData(previewData)) {
    const previewDataId = previewData.id;
    const { draftKey } = previewData;
    const draftRes = await devCMS.getBlogPreview(previewDataId, draftKey);
    blogs.contents.unshift(draftRes);
  }

  return {
    props: {
      blogs,
      categories,
    },
  };
};

export default BlogsPage;
