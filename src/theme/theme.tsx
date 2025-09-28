import { ThemeConfig } from "antd";

export const colors = {
  primary: "#337866",
  secondary: "#265b4e",
};

const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
  },
  components: {
    Layout: {
      headerBg: colors.secondary,
      headerHeight: 64,
      headerPadding: 18,
    },
  },
};

export default theme;
