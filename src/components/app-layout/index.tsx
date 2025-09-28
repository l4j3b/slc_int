"use client";

import { Layout } from "antd";

import Logo from "@/components/logo";

const { Header, Content } = Layout;

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="h-full">
      <Header className="flex items-center">
        <Logo className="h-8" />
      </Header>
      <Content className="p-6">{children}</Content>
    </Layout>
  );
}
