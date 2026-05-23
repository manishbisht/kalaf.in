import PolicyLayout, { HELP_CROSS_LINKS } from '../../components/PolicyLayout'

const data = {
  eyebrow: 'Guide 01',
  title: 'Size guide',
  ornament: 'माप',
  summary: "Every Kalaf piece is cut in Jaipur with relaxed, generous proportions. Find your fit below.",
  updated: '23 May 2026',
  readTime: '2 min read',
  crossLinksHeader: 'More guides',
  promises: [
    {
      kicker: 'True',
      label: 'To size',
      body: "Our pieces run as labelled. If you're between sizes, size down for a cleaner silhouette.",
    },
    {
      kicker: 'Relaxed',
      label: 'Fit',
      body: "We cut with generous ease. The measurements below are garment measurements, not body measurements.",
    },
    {
      kicker: 'Free',
      label: 'Alterations',
      body: "If the fit isn't quite right after purchase, we'll recommend a local tailor in your city.",
    },
  ],
  sections: [
    {
      id: 'sizing',
      title: 'How we size',
      body: [
        {
          kind: 'p',
          text: "Kalaf pieces run in S, M, L, XL. Our cuts are relaxed and slightly oversized — if you're between sizes, size down.",
        },
        {
          kind: 'p',
          text: 'All measurements below are garment measurements in centimetres, taken flat. Your body measurement will be smaller.',
        },
      ],
    },
    {
      id: 'chest',
      title: 'Chest & shoulder',
      body: [
        {
          kind: 'p',
          text: "Measure across the widest point of your chest with the tape horizontal. Our garment measurements include 10–14 cm of ease.",
        },
        {
          kind: 'list',
          items: [
            'S — chest 88–96 cm, shoulder 44 cm',
            'M — chest 96–104 cm, shoulder 46 cm',
            'L — chest 104–112 cm, shoulder 48 cm',
            'XL — chest 112–120 cm, shoulder 50 cm',
          ],
        },
      ],
    },
    {
      id: 'length',
      title: 'Length',
      body: [
        {
          kind: 'p',
          text: "We measure length from the highest point of the shoulder seam to the hem. Kurta lengths vary by style — check the individual product page for specifics.",
        },
      ],
      callout: { label: 'Average body length', value: 'S 70 cm · M 72 cm · L 74 cm · XL 76 cm' },
    },
    {
      id: 'unsure',
      title: "Still unsure?",
      body: [
        {
          kind: 'p',
          text: "Email us at hello@kalaf.in with your chest, shoulder, and height measurements and the piece you're looking at. We'll tell you exactly which size to order.",
        },
      ],
      callout: { label: 'Write to us', value: 'hello@kalaf.in' },
    },
  ],
}

export default function SizeGuide() {
  return <PolicyLayout data={data} currentSlug="size-guide" crossLinks={HELP_CROSS_LINKS} />
}
