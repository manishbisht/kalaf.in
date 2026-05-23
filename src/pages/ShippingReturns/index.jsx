import PolicyLayout, { POLICY_CROSS_LINKS } from '../../components/PolicyLayout'

const data = {
  eyebrow: 'Policy 02',
  title: 'Shipping & returns',
  ornament: 'नियम',
  summary:
    'Two simple rules. We ship within 48 hours from Jaipur. You have 14 days to send it back if it doesn’t feel right.',
  updated: '23 May 2026',
  readTime: '3 min read',
  promises: [
    {
      kicker: '48 h',
      label: 'Time to ship',
      body: 'Orders placed before 4pm IST ship the next working day from Jaipur.',
    },
    {
      kicker: '14 d',
      label: 'Return window',
      body: 'Send it back unworn with the tag intact. We book the courier pickup.',
    },
    {
      kicker: '₹ 0',
      label: 'Pickup cost',
      body: 'We pay for the return courier. You pay nothing to send it back.',
    },
  ],
  sections: [
    {
      id: 'ship',
      title: 'Shipping',
      body: [
        {
          kind: 'p',
          text: 'Orders placed before 4pm IST ship the next working day. Orders placed after, ship the day after that.',
        },
        {
          kind: 'p',
          text: 'Free standard shipping on orders over ₹ 3,000. Below that, a flat ₹ 99 covers it.',
        },
        {
          kind: 'p',
          text: 'Express delivery is available at checkout for ₹ 249 (2–3 working days to most metro pincodes). International shipping rolls out later this year.',
        },
        {
          kind: 'p',
          text: 'You’ll get a tracking link the moment the courier picks it up.',
        },
      ],
      callout: { label: 'When you’ll have it', value: '4–6 working days across India.' },
    },
    {
      id: 'returns',
      title: '14-day returns',
      body: [
        {
          kind: 'p',
          text: '14 days from delivery, on any unworn piece with the original tag intact. No restocking fee.',
        },
        {
          kind: 'p',
          text: 'Start a return from your account page or by replying to your order confirmation email. We’ll book a courier pickup within 48 hours.',
        },
        {
          kind: 'p',
          text: 'The refund lands in your original payment method within 5–7 working days of us receiving the piece.',
        },
      ],
      steps: [
        'Reply to your order confirmation or open the order in your account.',
        'We confirm and book a courier pickup, usually within 48 hours.',
        'Pack the piece in its original tag-on state.',
        'Once we receive it, the refund moves in 5–7 working days.',
      ],
    },
    {
      id: 'exchange',
      title: 'Exchanges',
      body: [
        {
          kind: 'p',
          text: 'Wrong size? We’ll exchange it one-for-one, free, within the 14-day window.',
        },
        {
          kind: 'p',
          text: 'Wrong colour or different piece entirely? Return for refund and place a fresh order — easier and faster than wiring an exchange.',
        },
      ],
    },
    {
      id: 'noreturn',
      title: 'What we can’t take back',
      body: [
        {
          kind: 'list',
          items: [
            'Anything visibly worn, washed, or with the tag removed.',
            'Pieces marked Final Sale on the product page — usually our last few units in a colourway.',
            'Innerwear, when we eventually stock it.',
          ],
        },
      ],
    },
    {
      id: 'damaged',
      title: 'If something arrives damaged',
      body: [
        {
          kind: 'p',
          text: 'Email hello@kalaf.in with a photo within 48 hours of delivery and we’ll replace or refund — no return shipment needed on our end.',
        },
      ],
      callout: { label: 'Write to', value: 'hello@kalaf.in' },
    },
  ],
}

export default function ShippingReturns() {
  return <PolicyLayout data={data} currentSlug="returns" crossLinks={POLICY_CROSS_LINKS} />
}
