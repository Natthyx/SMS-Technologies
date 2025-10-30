import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
}

const SEO = ({ 
  title = "SMS Technologies - Turning Ideas into Reliable Digital Solutions",
  description = "SMS Technologies transforms innovative ideas into reliable digital solutions. We specialize in custom software development, web applications, mobile solutions, and IT consulting services.",
  keywords = "SMS Technologies, software development, web development, mobile apps, IT consulting, digital solutions, technology services, custom software, web applications, mobile solutions",
  author = "SMS Technologies",
  ogTitle,
  ogDescription,
  ogImage = "/sms-logo.png",
  ogUrl = "https://smstechnologieset.com/",
  twitterTitle,
  twitterDescription,
  twitterImage = "/sms-logo.png",
  canonicalUrl
}: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },
      { property: 'og:title', content: ogTitle || title },
      { property: 'og:description', content: ogDescription || description },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: ogUrl },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'SMS Technologies' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:title', content: twitterTitle || title },
      { property: 'twitter:description', content: twitterDescription || description },
      { property: 'twitter:image', content: twitterImage },
      { name: 'theme-color', content: '#2C40F3' }
    ];

    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(tag.name ? 'name' : 'property', tag.name || tag.property || '');
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    // Update or create canonical link
    if (canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Clean up function
    return () => {
      // We don't remove the meta tags as they might be used by other pages
    };
  }, [
    title, description, keywords, author, ogTitle, ogDescription, 
    ogImage, ogUrl, twitterTitle, twitterDescription, twitterImage, canonicalUrl
  ]);

  return null;
};

export default SEO;