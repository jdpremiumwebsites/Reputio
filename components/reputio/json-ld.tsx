const SITE_URL = 'https://reputio.nl'

const founder = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#jael-dijk`,
  name: 'Jaël Dijk',
  jobTitle: 'Oprichter & CEO van Reputio',
  description:
    'Jaël Dijk is de oprichter, ontwerper en ontwikkelaar van Reputio en eigenaar van JD Premium Websites.',
  worksFor: [
    { '@type': 'Organization', name: 'Reputio', url: SITE_URL },
    { '@type': 'Organization', name: 'JD Premium Websites', url: 'https://www.jdpremiumwebsites.nl' },
  ],
  url: 'https://www.jdpremiumwebsites.nl',
  nationality: { '@type': 'Country', name: 'Nederland' },
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    founder,
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'Reputio',
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'nl-NL',
      description:
        'High-end reputation management engine voor het Nederlandse MKB. Transformeer tevreden klanten automatisch in 5-sterren Google reviews en vang negatieve feedback privé op.',
      author: { '@id': `${SITE_URL}/#jael-dijk` },
      creator: { '@id': `${SITE_URL}/#jael-dijk` },
      publisher: {
        '@type': 'Organization',
        name: 'Reputio',
        url: SITE_URL,
        founder: { '@id': `${SITE_URL}/#jael-dijk` },
      },
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '0', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Pro', price: '19', priceCurrency: 'EUR' },
        { '@type': 'Offer', name: 'Agency', price: '49', priceCurrency: 'EUR' },
      ],
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '1200' },
    },
  ],
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Static, server-defined object; escaping `<` prevents breaking out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  )
}
