import styled from "react-emotion";

export default styled("div")(({ options: o }) => ({
  position: "relative",

  ...scrollingProps(o),

  ...o.styles
}));

function scrollingProps(o) {
  switch (o.position) {
    case "hidden":
      return {
        position: "sticky",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(-${o.selfHeight}px)`,

        ...o.disabledStyles
      };
    case "ready":
      return {
        position: "sticky",
        transition: "transform 0.5s ease",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,
        transform: `translateY(-${o.selfHeight}px)`,

        ...o.readyStyles
      };
    case "active": {
      return {
        position: "sticky",
        transition: "transform 0.5s ease",
        zIndex: 10,
        top: 0,
        left: 0,
        right: 0,

        ...o.activeStyles
      };
    }
    default:
      return {};
  }
}
