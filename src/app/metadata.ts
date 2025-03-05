import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SarangResepi",
  description: "Your personal Malaysian recipe collection",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any"
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32"
      }
    ],
    apple: {
      url: "/apple-icon.png",
      type: "image/png",
      sizes: "180x180"
    }
  }
};
