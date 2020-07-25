import React from "react";
import style from "./IconButton.module.scss";
import { Button } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import IconButtonType from "../../enums/IconButtonType";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkIcon from "@material-ui/icons/Link";

interface Props {
  iconButtonType: IconButtonType;
  //TODO:本当はbuttonPropsを送りたいが型がわからんかった
  href: string;
  ariaLabel: string;
}

const GitHubButton: React.FC<Props> = (props: Props) => {
  const { href, iconButtonType, ariaLabel } = props;

  const renderButton = () => {
    switch (iconButtonType) {
      case IconButtonType.gitHub: {
        return (
          <Button
            variant="contained"
            className={style.github}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={ariaLabel}
          >
            <GitHubIcon />
          </Button>
        );
      }

      case IconButtonType.twitter: {
        return (
          <Button
            variant="contained"
            className={style.twitter}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={ariaLabel}
          >
            <TwitterIcon />
          </Button>
        );
      }

      case IconButtonType.siteLink: {
        return (
          <Button
            variant="contained"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={ariaLabel}
          >
            <LinkIcon />
          </Button>
        );
      }

      default: {
        return <></>;
      }
    }
  };

  return renderButton();
};

export default GitHubButton;
