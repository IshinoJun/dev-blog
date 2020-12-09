import React, { useState } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import style from './[offset].module.scss';

import DevCMS from '../../../../api/DevCMS';
import Blog from '../../../../../models/Blog';
import ArrayList from '../../../../../models/Array';
import Blogs from '../../../../../components/shared/Blogs';
import Tag from '../../../../../models/Tag';
import BlogsQuery from '../../../../../models/BlogsQuery';
import BlogSideContents from '../../../../../components/shared/BlogSideContents';

interface Props {
  blogs: ArrayList<Blog>;
  tags: ArrayList<Tag>;
  targetTag: Tag;
}

const TagBlogsPage: NextPage<Props> = (props: Props) => {
  const { blogs, tags, targetTag } = props;
  const defaultTitle = 'JI23-DEV';
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
    <>
      <Head>
        <title>{`${targetTag.name} | ${defaultTitle}`}</title>
        <meta
          property="og:title"
          content={`${targetTag.name} | ${defaultTitle}`}
        />
        <meta
          name="twitter:title"
          content={`${targetTag.name}  | ${defaultTitle}`}
        />
      </Head>
      <section className="padding-block border-bottom">
        <div className={style.tagNameWrapper}>
          <h1>{targetTag.name}</h1>
        </div>
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
    </>
  );
};

const createPath = (tags: ArrayList<Tag>, blogs: ArrayList<Blog>[]) => {
  return tags.contents.reduce((paths: string[], tag: Tag, i: number) => {
    const nextPaths = [...Array(blogs[i].offset + 1)]
      .map((_, i2) => i2 + 1)
      .map((offset) => `/blogs/tags/${tag.id ?? ''}/page/${offset}`);

    return [...paths, ...nextPaths];
  }, []);
};

const getPaths = async (tags: ArrayList<Tag>) => {
  const devCMS = new DevCMS();
  const res: Promise<ArrayList<Blog>>[] = [];
  tags.contents.forEach((tag) => {
    const query: BlogsQuery = { tagId: tag.id };
    const blogs = devCMS.getBlogs(query);
    res.push(blogs);
  });

  return createPath(tags, await Promise.all(res));
};

export const getStaticPaths: GetStaticPaths = async () => {
  const devCMS = new DevCMS();
  const tags = await devCMS.getTags();
  const paths = await getPaths(tags);

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<{
  props: Props;
}> => {
  const devCMS = new DevCMS();
  const tagId = params?.id?.toString() ?? '';
  const offset = params?.offset?.toString() ?? '';
  const query: BlogsQuery = { tagId, offset };
  const blogs = await devCMS.getBlogs(query);
  const tags = await devCMS.getTags();
  const targetTag = await devCMS.getTag(tagId);

  return {
    props: {
      blogs,
      tags,
      targetTag,
    },
  };
};

export default TagBlogsPage;