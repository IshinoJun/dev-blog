import React, { useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import style from './index.module.scss';

import DevCMS from '../api/DevCMS';
import Blog from '../../models/Blog';
import ArrayList from '../../models/Array';
import { isPreviewData } from '../../utils/TypeGuardUtils';
import Tag from '../../models/Tag';
import Blogs from '../../components/shared/Blogs';
import BlogSideContents from '../../components/shared/BlogSideContents';
import createOgp from '../../utils/server/ogpUtils';
import BlogsQuery from '../../models/BlogsQuery';

interface Props {
  blogs: ArrayList<Blog>;
  tags: ArrayList<Tag>;
}

const BlogsPage: NextPage<Props> = (props: Props) => {
  const { blogs, tags } = props;
  const [keyword, setKeyword] = useState<string>('');
  const router = useRouter();

  const handleClickSearchButton = () => {
    void router.push(`/blogs/search/?keyword=${keyword}`);
  };

  const handleKeyDownSearch = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.key === 'Enter') {
      void router.push(`/blogs/search/?keyword=${keyword}`);
    }
  };

  return (
    <section className="padding-block border-bottom">
      <div className={`${String(style.blogsContainer)} container`}>
        <div className={style.mainWrapper}>
          <Blogs blogs={blogs} showPagination />
        </div>
        <div className={style.sideWrapper}>
          <BlogSideContents
            keyword={keyword}
            tags={tags}
            onClickSearchButton={handleClickSearchButton}
            onKeyDownSearch={handleKeyDownSearch}
            setKeyword={setKeyword}
          />
        </div>
      </div>
    </section>
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
  const tags = await devCMS.getTags();

  blogs.contents.forEach((blog) => {
    void createOgp(blog);
  });

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
      tags,
    },
  };
};

export default BlogsPage;
