// HCI: S8 Reduce STM Load — rich mock data prevents blank states
// HCI: N2 Match Real World — realistic email content users recognise

import type { Account, Label, Email, Person } from '../types';

const now = Date.now();
const m = (mins: number): string => new Date(now - mins * 60 * 1000).toISOString();

export const mockAccounts: Account[] = [
  { id: 'primary',  name: 'Sudarshan Sudhakar', email: 'sudarshan@lucidmail.app', avatar: 'SS', color: '#6366f1', isPrimary: true },
  { id: 'work',     name: 'Sudarshan (Work)',   email: 'sudarshan@acme.corp',      avatar: 'SW', color: '#0891b2' },
  { id: 'personal', name: 'Sudarshan Personal', email: 'sudarshan.personal@gmail.com', avatar: 'SP', color: '#059669' },
];

export const mockLabels: Label[] = [
  { id: 'inbox',    name: 'Inbox',    system: true,  color: null },
  { id: 'starred',  name: 'Starred',  system: true,  color: null },
  { id: 'sent',     name: 'Sent',     system: true,  color: null },
  { id: 'drafts',   name: 'Drafts',   system: true,  color: null },
  { id: 'spam',     name: 'Spam',     system: true,  color: null },
  { id: 'trash',    name: 'Trash',    system: true,  color: null },
  { id: 'work',     name: 'Work',     system: false, color: '#0891b2' },
  { id: 'personal', name: 'Personal', system: false, color: '#059669' },
  { id: 'finance',  name: 'Finance',  system: false, color: '#d97706' },
  { id: 'travel',   name: 'Travel',   system: false, color: '#7c3aed' },
];

const people: Person[] = [
  { name: 'Priya Sharma',      email: 'priya.sharma@acme.corp',    avatar: 'PS', color: '#7c3aed' },
  { name: 'Arjun Mehta',       email: 'arjun.mehta@gmail.com',     avatar: 'AM', color: '#0891b2' },
  { name: 'Sarah Johnson',     email: 'sarah.j@techcorp.io',       avatar: 'SJ', color: '#059669' },
  { name: 'Vikram Nair',       email: 'vikram@startup.in',         avatar: 'VN', color: '#d97706' },
  { name: 'LinkedIn',          email: 'notifications@linkedin.com',avatar: 'LI', color: '#0077b5' },
  { name: 'GitHub',            email: 'noreply@github.com',        avatar: 'GH', color: '#24292e' },
  { name: 'Amazon',            email: 'order-update@amazon.in',    avatar: 'AZ', color: '#ff9900' },
  { name: 'Google Workspace',  email: 'workspace@google.com',      avatar: 'GW', color: '#4285f4' },
  { name: 'Figma',             email: 'no-reply@figma.com',        avatar: 'FG', color: '#f24e1e' },
  { name: 'Notion',            email: 'notify@notion.so',          avatar: 'NT', color: '#000000' },
  { name: 'Ananya Gupta',      email: 'ananya.gupta@university.edu',avatar:'AG', color: '#dc2626' },
  { name: 'Rahul Kapoor',      email: 'rahul.k@consulting.co',     avatar: 'RK', color: '#6366f1' },
  { name: 'Meera Pillai',      email: 'meera.p@designstudio.com',  avatar: 'MP', color: '#ec4899' },
  { name: 'HDFC Bank',         email: 'alerts@hdfcbank.com',       avatar: 'HD', color: '#004c8f' },
  { name: 'Swiggy',            email: 'noreply@swiggy.in',         avatar: 'SW', color: '#fc8019' },
  { name: 'Deepika Rao',       email: 'deepika.rao@product.co',    avatar: 'DR', color: '#be185d' },
  { name: 'Karan Singh',       email: 'karan.singh@dev.io',        avatar: 'KS', color: '#15803d' },
  { name: 'Nadia Ahmed',       email: 'nadia.ahmed@research.org',  avatar: 'NA', color: '#b45309' },
  { name: 'Stripe',            email: 'support@stripe.com',        avatar: 'ST', color: '#635bff' },
  { name: 'Atlassian',         email: 'no-reply@atlassian.com',    avatar: 'AT', color: '#0052cc' },
];

export const mockEmails: Email[] = [
  {
    id: 'e-cj', subject: 'Kerala Trip Pics',
    from: { name: 'CJ', email: 'cj@random.mail.com', avatar: 'CJ', color: '#f59e0b' },
    to: [{ name: 'Sudarshan', email: 'sudarshan@lucidmail.app', avatar: 'SS', color: '#6366f1' }],
    account: 'primary',
    threadId: 't-cj', isRead: false, isStarred: true, labels: ['inbox'],
    timestamp: m(5),
    preview: 'Hi! Here are some pics from our trip to Kerala. The backwaters were absolutely stunning.',
    body: `<p>Hi!</p><p>Here are some pics from our trip to Kerala. The backwaters were absolutely stunning and the tea gardens were breathtaking.</p><p>Let me know what you think!</p><p>Regards,<br>CJ</p>`,
    images: [
      { alt: 'Kerala Backwaters', gradient: 'linear-gradient(135deg, #1a6b8a 0%, #2d9bc4 100%)' },
      { alt: 'Tea Gardens', gradient: 'linear-gradient(135deg, #2d6a2d 0%, #4caf50 100%)' },
      { alt: 'Waterfalls', gradient: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)' },
      { alt: '+ 14 More', gradient: 'linear-gradient(135deg, #333 0%, #555 100%)', isMore: true, count: 14 },
    ],
    smartReplies: ['Looks great!', 'Love the photos!', 'Thanks for sharing!'],
    attachmentLabel: '17 Images',
  },
  {
    id: 'e-spam', subject: 'Please buy our product — Amazing deals you cannot miss',
    from: { name: 'SpamAlert', email: 'spam@unknown-mailer.net', avatar: 'SP', color: '#ef4444' },
    to: [{ name: 'Sudarshan', email: 'sudarshan@lucidmail.app', avatar: 'SS', color: '#6366f1' }],
    account: 'primary',
    threadId: 't-spam', isRead: false, isStarred: false, labels: ['inbox'],
    isSpamDetected: true,
    attachments: [],
    timestamp: m(30),
    preview: 'Amazing deals you cannot miss! Click here now to get 90% off everything!',
    body: `<p>Amazing deals you cannot miss! Click here now to get 90% off everything!</p>`,
    smartReplies: [],
    attachmentLabel: null,
  },
  {
    id: 'e1', subject: 'Q3 Design Review — action items inside',
    from: people[0], to: [people[11]], account: 'primary',
    threadId: 't1', isRead: false, isStarred: true, labels: ['inbox', 'work'],
    attachments: [{ name: 'design-review-q3.pdf', size: '2.4 MB' }],
    timestamp: m(3),
    preview: "Hi Sudarshan, following up on the Q3 design review. I've attached the PDF with all action items...",
    body: `<p>Hi Sudarshan,</p>
<p>Following up on the Q3 design review session. I've attached the PDF with all action items and owners. Key points:</p>
<ul>
  <li>Navigation redesign — <strong>owner: you</strong>, due Friday</li>
  <li>Mobile breakpoints audit — owner: Meera, due next Monday</li>
  <li>Accessibility pass on onboarding flow — owner: team, due EOW</li>
</ul>
<p>Please confirm receipt and let me know if any items need re-prioritisation.</p>
<p>Regards,<br>Priya</p>`,
    smartReplies: ['Got it, thanks!', 'Will review today', 'Sounds good'],
  },
  {
    id: 'e2', subject: 'PR #142: Fix email list virtualization',
    from: people[1], to: [people[0]], account: 'primary',
    threadId: 't2', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(12),
    preview: 'arjun.mehta opened a pull request: Fix email list virtualization to prevent 500+ row render...',
    body: `<p><strong>arjun.mehta</strong> opened pull request <a href="#">#142</a></p>
<h3>Fix email list virtualization</h3>
<p>This PR implements windowed rendering for the email list. Previously rendering 500+ rows caused significant jank on low-end devices.</p>
<ul><li>Add virtual scroll container</li><li>Only render visible rows with 5-row buffer</li><li>Resize observer for dynamic row heights</li></ul>
<p>Closes #138</p>`,
    smartReplies: ['Will review', 'Looks good, merging', 'Needs changes'],
  },
  {
    id: 'e3', subject: 'Your flight to Mumbai — Booking Confirmed',
    from: people[6], to: [people[0]], account: 'personal',
    threadId: 't3', isRead: true, isStarred: true, labels: ['inbox', 'travel'],
    attachments: [{ name: 'boarding-pass.pdf', size: '512 KB' }],
    timestamp: m(45),
    preview: 'Your booking BOM2847 is confirmed. Departure: 6:45 AM, Terminal 2. Check-in opens 48 hours before...',
    body: `<h2 style="margin:0 0 16px">Booking Confirmed</h2>
<p>Booking Reference: <strong>BOM2847</strong></p>
<table style="border-collapse:collapse;width:100%;margin-bottom:16px">
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#666">Flight</td><td style="padding:8px 0;font-weight:500">AI 657</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#666">From</td><td style="padding:8px 0;font-weight:500">Bengaluru (BLR)</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#666">To</td><td style="padding:8px 0;font-weight:500">Mumbai (BOM)</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#666">Date</td><td style="padding:8px 0;font-weight:500">22 April 2026</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 0;color:#666">Departure</td><td style="padding:8px 0;font-weight:500">06:45 AM, Terminal 2</td></tr>
  <tr><td style="padding:8px 0;color:#666">Seat</td><td style="padding:8px 0;font-weight:500">14A (Window)</td></tr>
</table>
<p>Check-in opens 48 hours before departure.</p>`,
  },
  {
    id: 'e4', subject: 'HCI Project Submission — Extended Deadline',
    from: people[10], to: [people[0]], account: 'primary',
    threadId: 't4', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(90),
    preview: 'Dear students, the submission deadline for the HCI end-semester project has been extended to 28 April...',
    body: `<p>Dear students,</p>
<p>The submission deadline for the HCI end-semester project has been <strong>extended to 28 April 2026, 11:59 PM</strong>.</p>
<p>Please ensure your submission includes:</p>
<ol>
  <li>Working prototype (hosted URL or video demo)</li>
  <li>HCI audit report linking every component to course principles</li>
  <li>Reflection document (500 words)</li>
</ol>
<p>Late submissions will not be accepted. Contact me if you have questions.</p>
<p>Prof. Ananya Gupta<br>Dept. of Computer Science</p>`,
    smartReplies: ['Acknowledged', 'Thank you for the extension', 'Will submit on time'],
  },
  {
    id: 'e5', subject: 'Your HDFC Bank account statement — March 2026',
    from: people[13], to: [people[0]], account: 'primary',
    threadId: 't5', isRead: true, isStarred: false, labels: ['inbox', 'finance'],
    attachments: [{ name: 'statement-march-2026.pdf', size: '1.1 MB' }],
    timestamp: m(180),
    preview: 'Your account statement for March 2026 is ready. Total credits: 87,500. Total debits: 34,200...',
    body: `<p>Dear Sudarshan,</p>
<p>Your account statement for <strong>March 2026</strong> is now available.</p>
<table style="border-collapse:collapse;margin-bottom:16px">
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0;color:#666">Opening Balance</td><td style="padding:8px 0;font-weight:500">Rs. 1,24,300</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0;color:#666">Total Credits</td><td style="padding:8px 0;color:#16a34a;font-weight:500">+ Rs. 87,500</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0;color:#666">Total Debits</td><td style="padding:8px 0;color:#dc2626;font-weight:500">- Rs. 34,200</td></tr>
  <tr><td style="padding:8px 16px 8px 0;color:#333;font-weight:600">Closing Balance</td><td style="padding:8px 0;font-weight:700">Rs. 1,77,600</td></tr>
</table>
<p>Download your full statement from the attachment.</p>`,
  },
  {
    id: 'e6', subject: 'New comment on your Figma file "Lucid UI Kit"',
    from: people[8], to: [people[0]], account: 'work',
    threadId: 't6', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(240),
    preview: 'Meera Pillai commented: "The spacing on the email row hover state looks inconsistent with the...',
    body: `<p><strong>Meera Pillai</strong> commented on <a href="#">Lucid UI Kit</a>:</p>
<blockquote style="border-left:3px solid #ccc;padding-left:1rem;margin-left:0;color:#555">
  "The spacing on the email row hover state looks inconsistent with the design tokens. The padding should be 12px not 10px per the comfortable density spec."
</blockquote>
<p><a href="#">Reply to comment</a> | <a href="#">View in Figma</a></p>`,
    smartReplies: ['Will fix it', 'Good catch, thanks', 'Updated now'],
  },
  {
    id: 'e7', subject: 'Weekly Digest: Top stories in UX Design',
    from: { name: 'UX Collective', email: 'digest@uxdesign.cc', avatar: 'UX', color: '#0891b2' },
    to: [people[0]], account: 'personal',
    threadId: 't7', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(360),
    preview: '5 things that make users abandon forms. Why flat design fails accessibility. The return of skeuomorphism...',
    body: `<h2 style="margin:0 0 16px">UX Collective Weekly</h2>
<ul style="line-height:2">
  <li><a href="#">5 things that make users abandon forms</a></li>
  <li><a href="#">Why flat design fails accessibility</a></li>
  <li><a href="#">The return of skeuomorphism in 2026</a></li>
  <li><a href="#">Fitts' Law in the age of foldables</a></li>
  <li><a href="#">Building for cognitive accessibility</a></li>
</ul>`,
  },
  {
    id: 'e8', subject: 'Re: Consulting proposal — revised scope',
    from: people[11], to: [people[0]], account: 'work',
    threadId: 't8', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [{ name: 'proposal-v3.docx', size: '890 KB' }],
    timestamp: m(420),
    preview: "Sudarshan, attached the revised scope doc as discussed. I've removed the phase 3 deliverables...",
    body: `<p>Sudarshan,</p>
<p>Attached the revised scope document as discussed on the call. I have removed the Phase 3 deliverables and adjusted the timeline to 6 weeks from 8.</p>
<p>Key changes are highlighted in yellow in the doc. Please review and confirm before I send to the client.</p>
<p>Regards,<br>Rahul</p>`,
    smartReplies: ['Looks good', 'Will review shortly', 'Send it over'],
  },
  {
    id: 'e9', subject: 'Your order from Truffles has been delivered',
    from: people[14], to: [people[0]], account: 'personal',
    threadId: 't9', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(480),
    preview: 'Your order from Truffles has been delivered. Rate your experience to help us improve...',
    body: `<p>Your order from <strong>Truffles</strong> has been delivered!</p>
<p>Order #SW847291 — Rs. 640</p>
<p>Please rate your experience to help us improve our service.</p>`,
    smartReplies: ['Thanks!', 'Great service', 'Loved the food'],
  },
  {
    id: 'e10', subject: 'LinkedIn: 12 people viewed your profile this week',
    from: people[4], to: [people[0]], account: 'primary',
    threadId: 't10', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(600),
    preview: '12 people viewed your profile. 3 new connection requests. You appeared in 47 searches this week...',
    body: `<p><strong>12 people</strong> viewed your profile this week.</p>
<p><strong>3</strong> new connection requests waiting.</p>
<p>You appeared in <strong>47 searches</strong> this week.</p>`,
  },
  {
    id: 'e11', subject: 'Notion: You have 5 new mentions',
    from: people[9], to: [people[0]], account: 'work',
    threadId: 't11', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(720),
    preview: 'Priya mentioned you in "Sprint 14 Planning". Vikram mentioned you in "Design System Review"...',
    body: `<p>You have <strong>5 new mentions</strong> in Notion:</p>
<ul>
  <li>Priya Sharma mentioned you in <strong>Sprint 14 Planning</strong></li>
  <li>Vikram Nair mentioned you in <strong>Design System Review</strong></li>
  <li>Meera Pillai mentioned you in <strong>Q3 Roadmap</strong></li>
</ul>`,
  },
  {
    id: 'e12', subject: 'Google Workspace: Storage alert — 85% used',
    from: people[7], to: [people[0]], account: 'work',
    threadId: 't12', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(1440),
    preview: 'Your Google Workspace storage is 85% full (12.75 GB of 15 GB used). Consider upgrading...',
    body: `<p>Your Google Workspace storage is <strong>85% full</strong>.</p>
<p>12.75 GB of 15 GB used.</p>
<p>Consider <a href="#">upgrading your storage plan</a> or <a href="#">managing your files</a>.</p>`,
  },
  {
    id: 'e13', subject: 'GitHub: Security vulnerability in dependency',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 't13', isRead: false, isStarred: true, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(1500),
    preview: '[Dependabot] A high severity vulnerability was found in lodash@4.17.15 in your project lucid-mail...',
    body: `<p>Dependabot found a <strong>high severity vulnerability</strong> in your project <a href="#">lucid-mail</a>.</p>
<p>Package: <code>lodash@4.17.15</code><br>
CVE: <code>CVE-2021-23337</code><br>
Severity: <strong style="color:#dc2626">High</strong></p>
<p><a href="#">Review security alert</a> | <a href="#">Dismiss alert</a></p>`,
    smartReplies: ['Will patch it', 'On it', 'Creating a fix now'],
  },
  {
    id: 'e14', subject: 'Invoice #INV-2026-034 from DesignStudio',
    from: people[12], to: [people[0]], account: 'work',
    threadId: 't14', isRead: true, isStarred: false, labels: ['inbox', 'finance', 'work'],
    attachments: [{ name: 'invoice-034.pdf', size: '320 KB' }],
    timestamp: m(2880),
    preview: 'Please find attached invoice #INV-2026-034 for the UI audit services rendered in March 2026...',
    body: `<p>Dear Sudarshan,</p>
<p>Please find attached Invoice #INV-2026-034 for UI audit services rendered in March 2026.</p>
<table style="border-collapse:collapse;margin-bottom:16px">
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">UI Audit (20 hours)</td><td style="padding:8px 0;font-weight:500">Rs. 40,000</td></tr>
  <tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">GST 18%</td><td style="padding:8px 0;font-weight:500">Rs. 7,200</td></tr>
  <tr><td style="padding:8px 16px 8px 0;font-weight:600">Total</td><td style="padding:8px 0;font-weight:700">Rs. 47,200</td></tr>
</table>
<p>Payment due by 30 April 2026. UPI: meera@designstudio.com</p>`,
    smartReplies: ['Will process payment', 'Received, thank you', 'Payment sent'],
  },
  {
    id: 'e15', subject: 'Re: Team lunch on Friday?',
    from: people[3], to: [people[0]], account: 'primary',
    threadId: 't15', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(4320),
    preview: "Sure! I'm in for Friday lunch. Toit or Truffles? I say Toit — their new menu is excellent...",
    body: `<p>Sure! I'm in for Friday. Toit or Truffles?</p>
<p>I vote Toit — their new seasonal menu is excellent and it is a 5-minute walk from the office.</p>
<p>— Vikram</p>`,
    smartReplies: ['Toit works for me', 'I prefer Truffles', 'Either is fine'],
  },
  {
    id: 'e16', subject: 'Sarah Johnson wants to connect on LinkedIn',
    from: people[4], to: [people[0]], account: 'primary',
    threadId: 't16', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(5040),
    preview: 'Sarah Johnson (Senior UX Researcher at TechCorp) wants to connect with you on LinkedIn...',
    body: `<p><strong>Sarah Johnson</strong> (Senior UX Researcher at TechCorp) wants to connect with you.</p>
<p><a href="#">Accept connection</a> | <a href="#">View Profile</a></p>`,
  },
  {
    id: 'e17', subject: 'Amazon: Your package is out for delivery',
    from: people[6], to: [people[0]], account: 'personal',
    threadId: 't17', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(5760),
    preview: 'Your order (Logitech MX Keys Mini) is out for delivery. Expected by 8 PM today...',
    body: `<p>Your order is <strong>out for delivery</strong>!</p>
<p>Item: Logitech MX Keys Mini<br>
Order: #408-2847291-1234567<br>
Expected: Today by 8:00 PM</p>`,
  },
  {
    id: 'e18', subject: 'Lucid Mail Alpha Feedback — Survey Results',
    from: people[2], to: [people[0]], account: 'work',
    threadId: 't18', isRead: false, isStarred: true, labels: ['inbox', 'work'],
    attachments: [{ name: 'survey-results.xlsx', size: '1.8 MB' }],
    timestamp: m(7200),
    preview: "Hi, I've compiled the alpha feedback survey results. 87% of users rated the design positively...",
    body: `<p>Hi Sudarshan,</p>
<p>I have compiled the alpha feedback results from 42 participants. Highlights:</p>
<ul>
  <li>87% rated the design "good" or "excellent"</li>
  <li>Top praised feature: keyboard shortcut visibility</li>
  <li>Top pain point: compose window Z-order on small screens</li>
  <li>NPS score: 67 (up from 41 in prototype phase)</li>
</ul>
<p>Full data in the attached spreadsheet.</p>
<p>Sarah</p>`,
    smartReplies: ['Great results!', 'Sharing with the team', 'Will address the pain points'],
  },
  {
    id: 'e19', subject: 'Rent reminder — April 2026',
    from: { name: 'PropertyHive', email: 'reminders@propertyhive.in', avatar: 'PH', color: '#7c3aed' },
    to: [people[0]], account: 'personal',
    threadId: 't19', isRead: false, isStarred: false, labels: ['inbox', 'finance'],
    attachments: [],
    timestamp: m(8640),
    preview: 'Your rent payment of Rs. 28,000 for April 2026 is due on 5th April. Pay now to avoid late fees...',
    body: `<p>Your rent payment for April 2026 is due.</p>
<p>Amount: <strong>Rs. 28,000</strong><br>Due date: 5 April 2026<br>Property: 4B, Prestige Meridian, Whitefield</p>
<p><a href="#">Pay Now</a></p>`,
    smartReplies: ['Will pay today', 'Processing payment', 'Paid, please confirm'],
  },
  {
    id: 'e20', subject: 'Your feedback on issue #204 has been noted',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 't20', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(10080),
    preview: 'Thank you for your detailed feedback on issue #204. The maintainers have acknowledged your comment...',
    body: `<p>Your comment on issue <a href="#">#204</a> has been acknowledged.</p>
<p>The maintainers have added the <code>enhancement</code> label and scheduled it for the next milestone.</p>`,
  },
  {
    id: 'e25', subject: 'New message from your mentor',
    from: { name: 'Mentorship Platform', email: 'notify@mentorco.app', avatar: 'MC', color: '#6366f1' },
    to: [people[0]], account: 'primary',
    threadId: 't25', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(330),
    preview: 'Dr. Ananya Gupta sent you a message on MentorCo: "I reviewed your prototype — very impressive..."',
    body: `<p>Dr. Ananya Gupta sent you a message:</p><blockquote style="border-left:3px solid #6366f1;padding-left:1rem;margin-left:0;color:#555">"I reviewed your prototype — very impressive work. The HCI principles are clearly applied throughout. Well done."</blockquote>`,
    smartReplies: ['Thank you so much!', 'Really appreciate the feedback', 'Will keep improving'],
  },
  {
    id: 'e26', subject: 'Lucid design tokens v2 — please review',
    from: people[12], to: [people[0]], account: 'work',
    threadId: 't26', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [{ name: 'tokens-v2.json', size: '48 KB' }],
    timestamp: m(150),
    preview: 'Sudarshan, attached the updated design token spec. Main change: new semantic layer for dark mode...',
    body: `<p>Sudarshan,</p><p>Attached the updated design token spec. Main change: a new semantic layer for dark mode that maps directly to CSS variables. Please review before we publish to the team.</p><p>Meera</p>`,
    smartReplies: ['Will review today', 'On it', 'Looks good at first glance'],
  },
  {
    id: 'e27', subject: 'Re: Accessibility audit findings',
    from: people[2], to: [people[0]], account: 'work',
    threadId: 't27', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(55),
    preview: 'Following up on the accessibility audit. 3 critical issues need fixing before the beta launch...',
    body: `<p>Following up on the accessibility audit. 3 critical issues:</p>
<ol>
  <li>Missing alt text on email avatar images</li>
  <li>Focus trap not implemented in compose modal</li>
  <li>Color contrast on muted text fails WCAG AA</li>
</ol>
<p>These need to be fixed before the beta launch next week.</p>`,
    smartReplies: ['Will fix all three', 'On it — will update you EOD', 'Can we discuss tomorrow?'],
  },
  {
    id: 'e28', subject: 'Your Notion workspace weekly summary',
    from: people[9], to: [people[0]], account: 'work',
    threadId: 't28', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(2160),
    preview: '14 pages edited this week. 3 new comments. 2 tasks completed. Top active page: Sprint 14 Planning...',
    body: `<p>Your Notion workspace this week:</p><ul><li>14 pages edited</li><li>3 new comments</li><li>2 tasks completed</li><li>Most active page: Sprint 14 Planning</li></ul>`,
  },
  {
    id: 'e29', subject: 'Re: Figma auto layout — question',
    from: people[3], to: [people[0]], account: 'primary',
    threadId: 't29', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(22),
    preview: "Sudarshan, quick question — when using auto layout with min-width constraints, the component collapses...",
    body: `<p>Sudarshan, quick question about Figma auto layout:</p><p>When using auto layout with min-width constraints, the component collapses in a way that breaks the 8px grid. Have you run into this? Any workaround?</p>`,
    smartReplies: ['Yes, I have a fix', 'Let me check', 'Try using fill instead of fixed width'],
  },
  {
    id: 'e30', subject: 'Welcome to Lucid Mail — getting started',
    from: { name: 'Lucid Mail Team', email: 'welcome@lucidmail.app', avatar: 'LM', color: '#1a73e8' },
    to: [people[0]], account: 'primary',
    threadId: 't30', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(1),
    preview: "Welcome to Lucid Mail! Designed for clarity and speed. Here's how to get the most out of it...",
    body: `<p>Welcome to <strong>Lucid Mail</strong>!</p>
<p>Here is how to get started:</p>
<ul>
  <li>Press <kbd>C</kbd> to compose a new email</li>
  <li>Press <kbd>/</kbd> to search</li>
  <li>Press <kbd>?</kbd> to see all keyboard shortcuts</li>
  <li>Use the sidebar toggle to expand or collapse the navigation</li>
  <li>Customise your view density and theme in Settings</li>
</ul>
<p>Lucid Mail is designed with HCI principles at its core — every feature traces back to a usability guideline.</p>
<p>The Lucid Mail Team</p>`,
    smartReplies: ['Thanks for the welcome!', 'Looks great', 'Excited to use this'],
  },
  {
    id: 'e31', subject: 'Stripe: Payment received — Rs. 12,000',
    from: people[18], to: [people[0]], account: 'work',
    threadId: 't31', isRead: true, isStarred: false, labels: ['inbox', 'finance'],
    attachments: [{ name: 'receipt-2026-04-21.pdf', size: '128 KB' }],
    timestamp: m(3200),
    preview: 'A payment of Rs. 12,000 was received from Deepika Rao for the freelance design project...',
    body: `<p>A payment of <strong>Rs. 12,000</strong> has been received.</p>
<p>From: Deepika Rao<br>Reference: Freelance Design — April 2026<br>Transaction ID: txn_3OA9Kv2eZvKYlo2</p>
<p><a href="#">View receipt</a> | <a href="#">Download invoice</a></p>`,
  },
  {
    id: 'e32', subject: 'Re: Sprint 14 retrospective — notes and action items',
    from: people[15], to: [people[0]], account: 'work',
    threadId: 't32', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [{ name: 'retro-notes-sprint14.pdf', size: '256 KB' }],
    timestamp: m(2600),
    preview: "Hi team, attached the sprint 14 retro notes. Top action item: improve PR review turnaround time...",
    body: `<p>Hi team,</p>
<p>Attached the Sprint 14 retrospective notes. Three key action items:</p>
<ol>
  <li>Improve PR review turnaround — target 24 hours (owner: everyone)</li>
  <li>Add more integration tests before merging feature branches (owner: Arjun)</li>
  <li>Daily standup to move from 10 AM to 9:30 AM starting Monday (owner: Sudarshan)</li>
</ol>
<p>Deepika</p>`,
    smartReplies: ['Thanks for the notes', '9:30 works for me', 'Will prioritise PR reviews'],
  },
  {
    id: 'e33', subject: 'Atlassian: Your Jira board has 8 overdue tickets',
    from: people[19], to: [people[0]], account: 'work',
    threadId: 't33', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(1800),
    preview: '8 tickets on your Jira board are past their due date. Oldest: LUCID-47, overdue by 5 days...',
    body: `<p>You have <strong>8 overdue tickets</strong> on the Lucid board:</p>
<ul>
  <li>LUCID-47 — Dark mode token mapping (5 days overdue)</li>
  <li>LUCID-52 — Keyboard navigation audit (3 days overdue)</li>
  <li>LUCID-58 — Compose window focus trap (2 days overdue)</li>
  <li>+5 more — <a href="#">View all</a></li>
</ul>`,
    smartReplies: ['Will triage today', 'On it', 'Some of these need re-estimation'],
  },
  {
    id: 'e34', subject: 'Karan Singh commented on your code review',
    from: people[16], to: [people[0]], account: 'work',
    threadId: 't34', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(680),
    preview: 'Karan Singh left a comment on PR #148: "This approach works but consider memoizing the filter...',
    body: `<p><strong>Karan Singh</strong> commented on <a href="#">PR #148</a>:</p>
<blockquote style="border-left:3px solid #ccc;padding-left:1rem;margin-left:0;color:#555">
  "This approach works but consider memoizing the filter function. Running it on every render will cause performance issues once the email count exceeds a few hundred."
</blockquote>
<p><a href="#">Reply</a> | <a href="#">View PR</a></p>`,
    smartReplies: ['Good catch, will fix', 'Added the memo', 'Can we discuss this?'],
  },
  {
    id: 'e35', subject: 'Conference registration confirmed — UX India 2026',
    from: { name: 'UX India', email: 'events@uxindia.org', avatar: 'UI', color: '#6366f1' },
    to: [people[0]], account: 'primary',
    threadId: 't35', isRead: true, isStarred: true, labels: ['inbox', 'travel'],
    attachments: [{ name: 'ticket-ux-india-2026.pdf', size: '340 KB' }],
    timestamp: m(11520),
    preview: 'Your registration for UX India 2026 is confirmed. Event: 12-14 May 2026, Bengaluru. Badge...',
    body: `<p>Your registration for <strong>UX India 2026</strong> is confirmed.</p>
<p>Event: 12-14 May 2026<br>Venue: The Lalit Ashok, Bengaluru<br>Ticket: Professional Pass<br>Badge: #3847</p>
<p>Your ticket is attached. Present it at registration.</p>`,
  },
  {
    id: 'e36', subject: 'Nadia Ahmed shared a research paper with you',
    from: people[17], to: [people[0]], account: 'primary',
    threadId: 't36', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [{ name: 'hick-law-revisited-2025.pdf', size: '1.2 MB' }],
    timestamp: m(9800),
    preview: "Sudarshan, thought you'd find this useful for your HCI project. It revisits Hick's Law in the context...",
    body: `<p>Sudarshan,</p>
<p>Thought you would find this useful for your HCI project. The paper revisits Hick's Law in the context of modern adaptive interfaces — very relevant to what you are building.</p>
<p>Nadia</p>`,
    smartReplies: ['This is very helpful!', 'Thank you, will read it', 'Citing this in my report'],
  },
  {
    id: 'e21', subject: 'Draft: HCI Audit Report',
    from: people[0], to: [], account: 'primary',
    threadId: 't21', isRead: true, isStarred: false, labels: ['drafts'],
    attachments: [],
    timestamp: m(15),
    preview: 'This report documents the HCI principles applied to Lucid Mail...',
    body: `<p>This report documents the HCI principles applied to Lucid Mail and traces each design decision to a principle from the course reference.</p>`,
  },
  {
    id: 'e22', subject: 'Sprint 14 kick-off — agenda attached',
    from: people[0], to: [people[1], people[12]], account: 'work',
    threadId: 't22', isRead: true, isStarred: false, labels: ['sent'],
    attachments: [{ name: 'sprint14-agenda.pdf', size: '210 KB' }],
    timestamp: m(1200),
    preview: "Team, please find the Sprint 14 kick-off agenda attached. We'll cover velocity and blockers...",
    body: `<p>Team,</p><p>Sprint 14 kick-off agenda attached. See you at 10 AM!</p>`,
  },
  {
    id: 'e23', subject: '50% off your next Swiggy order — today only!',
    from: people[14], to: [people[0]], account: 'personal',
    threadId: 't23', isRead: true, isStarred: false, labels: ['spam'],
    attachments: [],
    timestamp: m(3600),
    preview: 'Use code SAVE50 for 50% off (up to Rs. 150) on your next order. Valid today only...',
    body: `<p>50% off on your next order! Use code <strong>SAVE50</strong>. Valid today only.</p>`,
  },
  {
    id: 'e24', subject: 'Old project files — can we delete?',
    from: people[11], to: [people[0]], account: 'work',
    threadId: 't24', isRead: true, isStarred: false, labels: ['trash'],
    attachments: [],
    timestamp: m(20160),
    preview: "Hey, I found some old project files from 2024. Should we delete them from the shared drive?...",
    body: `<p>Hey, found old project files from 2024. OK to delete from the shared drive?</p>`,
  },
];

export const mockContacts: Person[] = mockEmails
  .map(e => e.from)
  .filter((v, i, arr) => arr.findIndex(p => p.email === v.email) === i)
  .filter(c => !['noreply@github.com', 'notifications@linkedin.com', 'noreply@swiggy.in', 'workspace@google.com', 'no-reply@figma.com', 'notify@notion.so'].includes(c.email));
