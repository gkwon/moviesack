import Script from 'next/script'

/*
 * Google Analytics 4 (gtag.js)
 *
 * Rendered from the root layout. Loaded with `afterInteractive` so the tag
 * never blocks first paint. GA4's enhanced measurement listens to History API
 * changes, so client-side navigations (discover → search → movie detail) are
 * counted as page_views without any manual router wiring.
 *
 * The measurement ID comes from NEXT_PUBLIC_GA_ID. If it is unset — or we are
 * not in a production build — nothing is rendered, so local dev and preview
 * traffic stay out of the property.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  if (!GA_ID || process.env.NODE_ENV !== 'production') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  )
}
