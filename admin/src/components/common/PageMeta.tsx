import { HelmetProvider, Helmet } from "react-helmet-async";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  let cleanTitle = title || "Happy Life Admin";
  if (cleanTitle.includes("TailAdmin") || cleanTitle.includes("React.js")) {
    cleanTitle = cleanTitle
      .replace(/React\.js\s*/gi, "")
      .replace(/\s*Dashboard\s*\|\s*TailAdmin.*$/gi, " | Happy Life Admin")
      .replace(/\|\s*TailAdmin.*$/gi, "| Happy Life Admin")
      .replace(/TailAdmin/gi, "Happy Life Admin")
      .trim();
    if (!cleanTitle.includes("Happy Life Admin")) {
      cleanTitle = `${cleanTitle} | Happy Life Admin`;
    }
  }

  const cleanDescription = (description || "")
    .replace(/TailAdmin/gi, "Happy Life Admin")
    .replace(/React\.js\s*/gi, "");

  return (
    <Helmet>
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
    </Helmet>
  );
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
