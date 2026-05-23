import PolicyLayout, { POLICY_CROSS_LINKS } from '../../components/PolicyLayout'

const data = {
  eyebrow: 'Policy 04',
  title: 'Refund policy',
  ornament: 'वापसी',
  summary: "We process refunds within 5–7 working days of receiving your return. Here's exactly how it works.",
  updated: '23 May 2026',
  readTime: '2 min read',
  promises: [
    {
      kicker: '5–7 d',
      label: 'Processing time',
      body: 'From the day we receive your return to the day the refund hits your account.',
    },
    {
      kicker: '₹ 0',
      label: 'Return courier',
      body: 'We book and pay for the pickup. You pay nothing to send it back.',
    },
    {
      kicker: '14 d',
      label: 'Return window',
      body: 'Pieces must be back with us within 14 days of your delivery date.',
    },
  ],
  sections: [
    {
      id: 'eligibility',
      title: 'Eligibility',
      body: [
        {
          kind: 'p',
          text: 'Items must be returned within 14 days of delivery, unworn, with the original tag attached.',
        },
        {
          kind: 'list',
          items: [
            'Unworn and in original condition.',
            'Tag still attached — the physical paper tag, not the label sewn into the garment.',
            'Purchased at full price. Final Sale items are not eligible.',
          ],
        },
      ],
    },
    {
      id: 'request',
      title: 'How to request',
      body: [
        {
          kind: 'p',
          text: 'Start a return from your account page or by replying directly to your order confirmation email.',
        },
      ],
      steps: [
        "Reply to your order confirmation or open the order in your account and select 'Return this item'.",
        "We'll confirm within 24 hours and book a courier pickup at no cost to you.",
        'Pack the item with the original tag on and hand it to the courier.',
        'Refund is processed within 5–7 working days of us receiving and inspecting the item.',
      ],
    },
    {
      id: 'timeline',
      title: 'Timeline',
      body: [
        {
          kind: 'p',
          text: 'Once we receive your return, we inspect it within 24 hours and initiate the refund. The money moves back to your original payment method — card, UPI, or BNPL.',
        },
      ],
      callout: { label: 'Refund arrives in', value: '5–7 working days.' },
    },
    {
      id: 'exceptions',
      title: "What we can't refund",
      body: [
        {
          kind: 'list',
          items: [
            'Items marked Final Sale on the product page.',
            'Anything visibly worn, washed, or with the tag removed.',
            'Items returned after the 14-day window.',
          ],
        },
        {
          kind: 'p',
          text: "If an item arrives damaged, email us with a photo within 48 hours of delivery. We'll replace or refund without requiring a return shipment.",
        },
      ],
      callout: { label: 'Damaged on arrival?', value: 'hello@kalaf.in — within 48 hours.' },
    },
  ],
}

export default function RefundPolicy() {
  return <PolicyLayout data={data} currentSlug="refund" crossLinks={POLICY_CROSS_LINKS} />
}
