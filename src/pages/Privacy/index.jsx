import PolicyLayout, { POLICY_CROSS_LINKS } from '../../components/PolicyLayout'

const data = {
  eyebrow: 'Policy 01',
  title: 'Privacy policy',
  ornament: 'गोपनीय',
  summary: "We collect only what we need to run the store. We don't sell your data, ever.",
  updated: '23 May 2026',
  readTime: '4 min read',
  sections: [
    {
      id: 'collect',
      title: 'What we collect',
      body: [
        {
          kind: 'p',
          text: "We collect your name, email address, shipping address, and payment method when you place an order. That's it.",
        },
        {
          kind: 'p',
          text: 'If you create an account, we store your order history and saved addresses so checkout is faster next time.',
        },
        {
          kind: 'p',
          text: 'We record basic browsing behaviour — which pages you visit, how long you spend on them — through first-party analytics.',
        },
      ],
    },
    {
      id: 'use',
      title: 'How we use it',
      body: [
        {
          kind: 'list',
          items: [
            'To fulfil and ship your order.',
            'To send you a tracking link and order updates.',
            'To improve the website based on how people actually use it.',
            "To send the Kalaf newsletter, if you've opted in.",
          ],
        },
      ],
    },
    {
      id: 'sharing',
      title: 'Sharing & disclosure',
      body: [
        {
          kind: 'p',
          text: 'We do not sell your data. We do not share it with third-party marketers.',
        },
        {
          kind: 'p',
          text: "We share your shipping address with our courier partner (currently Delhivery) to deliver your order. That's the only external sharing.",
        },
        {
          kind: 'p',
          text: "We may be required by law to share data with government authorities. We'll inform you if we can.",
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      body: [
        {
          kind: 'p',
          text: 'See our Cookie Policy for a full breakdown. In short: we use a session cookie to keep your cart intact, and optional analytics cookies to understand traffic.',
        },
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      body: [
        {
          kind: 'list',
          items: [
            'Request a copy of all data we hold about you.',
            'Ask us to correct or delete it.',
            'Withdraw consent for marketing emails at any time — click unsubscribe or email us.',
          ],
        },
      ],
      callout: { label: 'Write to', value: 'hello@kalaf.in' },
    },
  ],
}

export default function Privacy() {
  return <PolicyLayout data={data} currentSlug="privacy" crossLinks={POLICY_CROSS_LINKS} />
}
