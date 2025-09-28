"use client";

import { Layout } from "antd";

import { colors } from "@/theme/theme";
import Logo from "@/components/logo";

const { Header, Content } = Layout;

const HEADER_HEIGHT = 64;
const CONTENT_PADDING = 18;

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <Header
        style={{
          // backgroundColor: colors.secondary,
          // paddingLeft: CONTENT_PADDING,
          // paddingRight: CONTENT_PADDING,
          position: "sticky",
          top: 0,
          zIndex: 1000,
          // minHeight: HEADER_HEIGHT,
          // height: HEADER_HEIGHT,
        }}
        className="flex items-center"
      >
        <Logo className="h-10" />
      </Header>
      <Content
        style={{
          paddingTop: CONTENT_PADDING,
          paddingBottom: CONTENT_PADDING,
          paddingLeft: CONTENT_PADDING,
          paddingRight: CONTENT_PADDING,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflowY: "auto",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
