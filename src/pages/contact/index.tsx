import React from "react";
import style from "./index.module.scss";

import { NextPage } from "next";
import HeaderProps from "../../models/HeaderProps";
import Layout from "../../components/shared/Layout";
import { Grid, TextField, Button } from "@material-ui/core";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import Contact from "../../api/models/Contact";
import { useContextDevClient } from "../../context/DevClientContext";
import { useRouter } from "next/router";

const ContactIndex: NextPage = () => {
  const headerProps: HeaderProps = {
    title: "Contact",
    subTitle: "お問い合わせ",
    linkProps: { href: "/" },
    imgProps: { src: "/contact.png", alt: "Contact" },
  } as const;

  const devClient = useContextDevClient();

  const router = useRouter();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("名前は必須項目です"),
    email: Yup.string()
      .email("正しいメールアドレスではありません")
      .required("メールアドレスは必須です"),
    body: Yup.string().required("お問い合わせ内容は必須です。"),
  });

  const { control, handleSubmit, errors } = useForm<Contact>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  //TODO: エラーハンドリングを考えなきゃダメ
  const onSubmit = (contact: Contact) => {
    if (!devClient) return;

    void (async (): Promise<void> => {
      try {
        await devClient.createContact(contact);
      } catch (err) {
        return;
      }

      void router.push("/contact/success");
    })();
  };

  return (
    <Layout title="Contact | dev-blog" headerProps={headerProps}>
      <section className="padding-block border-bottom">
        <div className="container">
          <div className={style.contact}>
            <div className={style.title}>
              <h2>お問い合わせフォーム</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Controller
                    as={TextField}
                    control={control}
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="名前"
                    name="name"
                    autoComplete="name"
                    defaultValue=""
                    error={!!errors.name?.message}
                  />
                  {errors.name && (
                    <p className={style.error}>{errors.name.message}</p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    as={TextField}
                    control={control}
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="メールアドレス"
                    name="email"
                    autoComplete="email"
                    defaultValue=""
                    error={!!errors.email?.message}
                  />
                  {errors.email && (
                    <p className={style.error}>{errors.email.message}</p>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    as={TextField}
                    control={control}
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    rows={6}
                    name="body"
                    label="内容"
                    id="body"
                    autoComplete="body"
                    defaultValue=""
                    error={!!errors.body?.message}
                  />
                  {errors.body && (
                    <p className={style.error}>{errors.body.message}</p>
                  )}
                </Grid>
              </Grid>
              <Button type="submit" variant="contained" className={style.send}>
                送信
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactIndex;