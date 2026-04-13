import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogType?: string;
}

const DEFAULT_OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/3TUi3JNUmJQa4eVdOnmIkCiRgCJ3/social-images/social-1775235421165-IMG_0602.webp";

export default function SEOHead({
  title,
  description,
  canonical,
  noindex,
  ogImage,
  ogType = "website",
}: SEOHeadProps) {
  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}
