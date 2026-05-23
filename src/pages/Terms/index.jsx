import PolicyLayout, { POLICY_CROSS_LINKS } from '../../components/PolicyLayout'

const data = {
  eyebrow: 'Policy 03',
  title: 'Terms of use',
  ornament: 'नियम',
  summary: 'Straightforward rules for using the Kalaf website and placing orders. Nothing unusual.',
  updated: '23 May 2026',
  readTime: '5 min read',
  sections: [
    {
      id: 'using',
      title: 'Using our site',
      body: [
        {
          kind: 'p',
          text: "By accessing kalaf.in, you agree to use it lawfully and not to reproduce, scrape, or republish our content without permission.",
        },
        {
          kind: 'p',
          text: "We reserve the right to restrict access to any user who violates these terms or whose behaviour we consider harmful to the site.",
        },
      ],
    },
    {
      id: 'account',
      title: 'Your account',
      body: [
        {
          kind: 'p',
          text: 'You are responsible for maintaining the confidentiality of your account credentials.',
        },
        {
          kind: 'p',
          text: 'You agree to provide accurate information when creating an account and to update your details when they change.',
        },
      ],
    },
    {
      id: 'orders',
      title: 'Orders & payment',
      body: [
        {
          kind: 'p',
          text: "An order confirmation does not constitute acceptance. We accept your order when we dispatch your item and send a shipping confirmation.",
        },
        {
          kind: 'p',
          text: 'We accept payments via card (Visa, Mastercard, Rupay), UPI, and select BNPL providers. All transactions are processed in INR.',
        },
        {
          kind: 'p',
          text: 'We reserve the right to cancel orders we suspect are fraudulent or placed using stolen payment details.',
        },
      ],
    },
    {
      id: 'ip',
      title: 'Intellectual property',
      body: [
        {
          kind: 'p',
          text: 'All photography, copy, brand marks, and design are the property of Kalaf Atelier Pvt. Ltd.',
        },
        {
          kind: 'p',
          text: 'You may share our content on social media for non-commercial purposes with attribution. Anything else requires written permission.',
        },
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: [
        {
          kind: 'p',
          text: "To the maximum extent permitted by law, Kalaf's liability for any claim related to these terms or your use of the site is limited to the value of the order in question.",
        },
        {
          kind: 'p',
          text: 'These terms are governed by the laws of Rajasthan, India. Any disputes are subject to the jurisdiction of courts in Jaipur.',
        },
      ],
    },
  ],
}

export default function Terms() {
  return <PolicyLayout data={data} currentSlug="terms" crossLinks={POLICY_CROSS_LINKS} />
}
