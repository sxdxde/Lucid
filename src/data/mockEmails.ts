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
  { id: 'receipts', name: 'Receipts', system: false, color: '#dc2626' },
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
    threadId: 't-cj', isRead: false, isStarred: true, labels: ['inbox', 'personal'],
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
    threadId: 't9', isRead: true, isStarred: false, labels: ['inbox', 'personal', 'receipts'],
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
    threadId: 't15', isRead: true, isStarred: false, labels: ['inbox', 'personal'],
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
    threadId: 't16', isRead: true, isStarred: false, labels: ['inbox', 'personal'],
    attachments: [],
    timestamp: m(5040),
    preview: 'Sarah Johnson (Senior UX Researcher at TechCorp) wants to connect with you on LinkedIn...',
    body: `<p><strong>Sarah Johnson</strong> (Senior UX Researcher at TechCorp) wants to connect with you.</p>
<p><a href="#">Accept connection</a> | <a href="#">View Profile</a></p>`,
  },
  {
    id: 'e17', subject: 'Amazon: Your package is out for delivery',
    from: people[6], to: [people[0]], account: 'personal',
    threadId: 't17', isRead: true, isStarred: false, labels: ['inbox', 'personal', 'receipts'],
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
    threadId: 't19', isRead: false, isStarred: false, labels: ['inbox', 'finance', 'receipts'],
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

  // ── Additional ARCHIVED emails ─────────────────────────
  {
    id: 'e-arch1', subject: 'Q2 Design System Audit — completed',
    from: people[0], to: [people[11]], account: 'work',
    threadId: 'ta1', isRead: true, isStarred: false, labels: ['archived', 'work'],
    attachments: [{ name: 'audit-q2-2026.pdf', size: '3.2 MB' }],
    timestamp: m(3 * 24 * 60),
    preview: 'Priya: The Q2 design system audit is fully complete. All components documented and versioned.',
    body: `<p>Hi Sudarshan,</p><p>The Q2 Design System audit is complete. All 148 components are documented with usage guidelines and versioned in the Figma library.</p><p>Archived for reference.</p><p>Priya</p>`,
    smartReplies: ['Thanks for the update', 'Will review it', 'Great work!'],
  },
  {
    id: 'e-arch2', subject: 'Team offsite — May 2026 recap',
    from: people[3], to: [people[0]], account: 'primary',
    threadId: 'ta2', isRead: true, isStarred: true, labels: ['archived'],
    attachments: [{ name: 'offsite-photos.zip', size: '45 MB' }],
    timestamp: m(5 * 24 * 60),
    preview: "Vikram: Attached are all the photos from the May offsite. Great team building session!",
    body: `<p>Hey Sudarshan,</p><p>Here are all the photos from the May team offsite. We covered a lot of ground on the roadmap. Attaching the photo album too — some great memories!</p><p>Vikram</p>`,
    smartReplies: ['Love the photos!', 'Great offsite', 'Thanks for sharing'],
  },
  {
    id: 'e-arch3', subject: 'Old GitHub repo — archive notice',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 'ta3', isRead: true, isStarred: false, labels: ['archived', 'work'],
    attachments: [],
    timestamp: m(7 * 24 * 60),
    preview: '[GitHub] The repository lucid-mail-v1 has been archived and is now read-only.',
    body: `<p>The repository <strong>lucid-mail-v1</strong> has been archived and is now read-only. All open issues have been closed. The codebase is preserved for historical reference.</p>`,
    smartReplies: ['Acknowledged', 'Thanks for the notice'],
  },
  {
    id: 'e-arch4', subject: 'Invoice INV-2025-011 — payment confirmed',
    from: { name: 'Stripe', email: 'support@stripe.com', avatar: 'ST', color: '#635bff' },
    to: [people[0]], account: 'work',
    threadId: 'ta4', isRead: true, isStarred: false, labels: ['archived', 'finance'],
    attachments: [{ name: 'receipt-nov-2025.pdf', size: '98 KB' }],
    timestamp: m(14 * 24 * 60),
    preview: 'Your invoice INV-2025-011 for Rs. 24,000 has been paid successfully.',
    body: `<p>Payment received for INV-2025-011 — Rs. 24,000. Receipt attached.</p>`,
  },
  {
    id: 'e-arch5', subject: 'Project Sunbird — final delivery',
    from: people[2], to: [people[0]], account: 'work',
    threadId: 'ta5', isRead: true, isStarred: true, labels: ['archived', 'work'],
    attachments: [{ name: 'sunbird-final.figma', size: '18 MB' }],
    timestamp: m(10 * 24 * 60),
    preview: 'Sarah: All deliverables for Project Sunbird are attached. Client has signed off. Archiving this thread.',
    body: `<p>Sudarshan,</p><p>All deliverables for Project Sunbird are attached. The client has formally signed off. Archiving this thread now.</p><p>Sarah</p>`,
    smartReplies: ['Great work!', 'Thanks Sarah', 'Closing it out'],
  },

  // ── Additional SPAM emails ─────────────────────────────
  {
    id: 'e-spam2', subject: 'YOU HAVE WON Rs. 10,00,000 — Claim Now!!!',
    from: { name: 'LotteryWin India', email: 'winner@lottery-scam.net', avatar: 'LW', color: '#ef4444' },
    to: [people[0]], account: 'primary',
    threadId: 'ts2', isRead: true, isStarred: false, labels: ['spam'],
    isSpamDetected: true, attachments: [],
    timestamp: m(2 * 24 * 60),
    preview: 'Congratulations! You have been randomly selected as a winner. Click here to claim your prize immediately!',
    body: `<p>CONGRATULATIONS! You have been selected as a LUCKY WINNER. Claim your Rs. 10,00,000 prize NOW!</p>`,
    smartReplies: [],
  },
  {
    id: 'e-spam3', subject: 'URGENT: Your account needs verification',
    from: { name: 'Security Alert', email: 'noreply@fakebank-secure.com', avatar: 'SA', color: '#ef4444' },
    to: [people[0]], account: 'primary',
    threadId: 'ts3', isRead: false, isStarred: false, labels: ['spam'],
    isSpamDetected: true, attachments: [],
    timestamp: m(3 * 24 * 60),
    preview: 'Your account has been flagged for suspicious activity. Click here immediately to verify and avoid suspension.',
    body: `<p>URGENT: Your account has been flagged. Click the link below to verify within 24 hours or your account will be suspended.</p>`,
    smartReplies: [],
  },
  {
    id: 'e-spam4', subject: 'Make Rs. 50,000/day working from home!',
    from: { name: 'Easy Money Scheme', email: 'rich@workatnightfromhome.biz', avatar: 'EM', color: '#ef4444' },
    to: [people[0]], account: 'primary',
    threadId: 'ts4', isRead: true, isStarred: false, labels: ['spam'],
    isSpamDetected: true, attachments: [],
    timestamp: m(4 * 24 * 60),
    preview: 'No experience needed! Join thousands already earning. Limited spots available. Sign up today!',
    body: `<p>Make Rs. 50,000 per day from home! No experience required. Limited time offer — sign up now!</p>`,
    smartReplies: [],
  },
  {
    id: 'e-spam5', subject: 'Bulk Discount Offer — Cheap Medicines Online',
    from: { name: 'PharmaDeal', email: 'deals@unlicensed-pharma.ru', avatar: 'PD', color: '#ef4444' },
    to: [people[0]], account: 'primary',
    threadId: 'ts5', isRead: true, isStarred: false, labels: ['spam'],
    isSpamDetected: true, attachments: [],
    timestamp: m(5 * 24 * 60),
    preview: 'Get prescription medicines without a prescription! 90% discount. No doctor needed.',
    body: `<p>Huge discounts on all medicines. No prescription required. Order online today!</p>`,
    smartReplies: [],
  },

  // ── Additional TRASH emails ────────────────────────────
  {
    id: 'e-trash2', subject: 'Newsletter unsubscribe confirmation',
    from: { name: 'TechDigest Weekly', email: 'newsletter@techdigest.io', avatar: 'TD', color: '#9aa0a6' },
    to: [people[0]], account: 'primary',
    threadId: 'tt2', isRead: true, isStarred: false, labels: ['trash'],
    attachments: [],
    timestamp: m(2 * 24 * 60),
    preview: "You've been successfully unsubscribed from TechDigest Weekly. You won't receive any more emails.",
    body: `<p>You have been unsubscribed from TechDigest Weekly. You will no longer receive our newsletters.</p>`,
  },
  {
    id: 'e-trash3', subject: 'Re: Happy birthday! 🎉',
    from: people[3], to: [people[0]], account: 'primary',
    threadId: 'tt3', isRead: true, isStarred: false, labels: ['trash'],
    attachments: [],
    timestamp: m(30 * 24 * 60),
    preview: "Thanks for the birthday wishes! It was a great day.",
    body: `<p>Thanks so much! It was a really great day — friends and family made it special.</p><p>— Vikram</p>`,
  },
  {
    id: 'e-trash4', subject: 'Flash sale ends tonight — 70% off',
    from: { name: 'Myntra', email: 'offers@myntra.com', avatar: 'MN', color: '#ff3f6c' },
    to: [people[0]], account: 'personal',
    threadId: 'tt4', isRead: true, isStarred: false, labels: ['trash'],
    attachments: [],
    timestamp: m(3 * 24 * 60),
    preview: "Tonight only! 70% off on top brands. Sale ends at midnight.",
    body: `<p>Flash sale ends tonight. Up to 70% off on all top brands. Shop now before it's too late!</p>`,
  },
  {
    id: 'e-trash5', subject: 'Your cab receipt — Rapido #R9283',
    from: { name: 'Rapido', email: 'receipts@rapido.bike', avatar: 'RP', color: '#ffcc00' },
    to: [people[0]], account: 'personal',
    threadId: 'tt5', isRead: true, isStarred: false, labels: ['trash'],
    attachments: [],
    timestamp: m(6 * 24 * 60),
    preview: "Your Rapido ride receipt: HSR Layout to Koramangala, Rs. 48. Thank you for riding with us!",
    body: `<p>Ride Receipt #R9283<br>From: HSR Layout<br>To: Koramangala<br>Amount: Rs. 48</p>`,
  },

  // ── Additional SENT emails ─────────────────────────────
  {
    id: 'e-sent2', subject: 'Re: Accessibility audit findings',
    from: people[0], to: [people[2]], account: 'work',
    threadId: 't27', isRead: true, isStarred: false, labels: ['sent'],
    attachments: [],
    timestamp: m(50),
    preview: "Thanks Sarah — I'll fix all three issues by end of day. Focus trap is the trickiest but I have a plan.",
    body: `<p>Sarah,</p><p>Thanks for the detailed audit. I'll fix all three issues by EOD:</p><ol><li>Alt text — 30 min fix</li><li>Focus trap — using focus-trap-react library</li><li>Color contrast — updating design tokens</li></ol><p>Sudarshan</p>`,
    smartReplies: [],
  },
  {
    id: 'e-sent3', subject: 'Lucid Mail — HCI project proposal',
    from: people[0], to: [people[10]], account: 'primary',
    threadId: 'ts-3', isRead: true, isStarred: false, labels: ['sent'],
    attachments: [{ name: 'hci-proposal.pdf', size: '1.4 MB' }],
    timestamp: m(5 * 24 * 60),
    preview: "Prof. Gupta — please find attached my HCI end-semester project proposal for Lucid Mail.",
    body: `<p>Dear Prof. Gupta,</p><p>Please find attached my HCI end-semester project proposal — <strong>Lucid Mail</strong>, a Gmail-inspired email client demonstrating applied HCI principles.</p><p>Happy to discuss in office hours.</p><p>Best,<br>Sudarshan Sudhakar</p>`,
  },
  {
    id: 'e-sent4', subject: 'Thank you — UX India 2026 talk',
    from: people[0], to: [{ name: 'UX India', email: 'events@uxindia.org', avatar: 'UI', color: '#6366f1' }], account: 'primary',
    threadId: 'ts-4', isRead: true, isStarred: false, labels: ['sent'],
    attachments: [],
    timestamp: m(12 * 24 * 60),
    preview: "Thank you for the opportunity to attend UX India 2026. The Fitts' Law talk was outstanding.",
    body: `<p>Thank you for a fantastic conference. The talk on Fitts' Law in modern interfaces was especially relevant to my current project.</p><p>Looking forward to next year!</p><p>Sudarshan</p>`,
  },
  {
    id: 'e-sent5', subject: 'Invitation — Lucid Mail beta testing',
    from: people[0], to: [people[1], people[2], people[3]], account: 'work',
    threadId: 'ts-5', isRead: true, isStarred: false, labels: ['sent'],
    attachments: [],
    timestamp: m(8 * 24 * 60),
    preview: "You're invited to beta test Lucid Mail before the public launch. Feedback form inside.",
    body: `<p>Team,</p><p>You are invited to beta test <strong>Lucid Mail</strong>. Please use it as your primary email client for the next two weeks and fill in the feedback form.</p><p>Login at: <a href="#">beta.lucidmail.app</a><br>Code: BETA2026</p><p>Sudarshan</p>`,
  },

  // ── Additional DRAFTS ──────────────────────────────────
  {
    id: 'e-draft2', subject: 'Draft: Email to investors — Q2 update',
    from: people[0], to: [], account: 'work',
    threadId: 'td2', isRead: true, isStarred: false, labels: ['drafts'],
    attachments: [],
    timestamp: m(3 * 60),
    preview: "Dear investors, I am writing to share our Q2 metrics. Monthly active users reached...",
    body: `<p>Dear investors,</p><p>I am writing to share our Q2 metrics. Monthly active users reached [X]. Key highlights this quarter:</p><ul><li>Feature X shipped</li><li>NPS improved from 41 to 67</li></ul>`,
  },
  {
    id: 'e-draft3', subject: 'Draft: Follow-up on consulting proposal',
    from: people[0], to: [people[11]], account: 'work',
    threadId: 'td3', isRead: true, isStarred: false, labels: ['drafts'],
    attachments: [],
    timestamp: m(90),
    preview: "Rahul, following up on the proposal we discussed last week. Have the clients reviewed it yet?",
    body: `<p>Rahul,</p><p>Following up on the consulting proposal from last week. Have the clients had a chance to review it? Let me know if any changes are needed before we proceed.</p>`,
  },

  // ── INBOX flood ────────────────────────────────────────
  {
    id: 'f1', subject: 'Your Zoom recording is ready',
    from: { name: 'Zoom', email: 'no-reply@zoom.us', avatar: 'ZM', color: '#2D8CFF' },
    to: [people[0]], account: 'work',
    threadId: 'tf1', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(8),
    preview: 'Your cloud recording for "Lucid Mail Sprint Review" (58 min) is ready to view and share.',
    body: `<p>Your cloud recording is ready.</p><p><strong>Meeting:</strong> Lucid Mail Sprint Review<br><strong>Duration:</strong> 58 minutes<br><strong>Date:</strong> 28 April 2026</p><p><a href="#">Watch Recording</a> | <a href="#">Share</a></p>`,
    smartReplies: ['Thanks!', 'Will share with the team', 'Noted'],
  },
  {
    id: 'f2', subject: 'Figma: Meera Pillai shared "Lucid v3 Mockups" with you',
    from: people[8], to: [people[0]], account: 'work',
    threadId: 'tf2', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(18),
    preview: 'Meera Pillai has shared a Figma file with you: "Lucid v3 Mockups". You can edit this file.',
    body: `<p><strong>Meera Pillai</strong> shared a Figma file with you.</p><p>File: <strong>Lucid v3 Mockups</strong><br>Permission: Can edit</p><p><a href="#">Open in Figma</a></p>`,
    smartReplies: ['Thanks Meera!', 'Opening now', 'Will review today'],
  },
  {
    id: 'f3', subject: 'Daily standup notes — 28 April 2026',
    from: people[15], to: [people[0]], account: 'work',
    threadId: 'tf3', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(25),
    preview: 'Sudarshan: Loading screen + onboarding tutorial. Meera: Token system v2. Arjun: PR #149 in review.',
    body: `<p><strong>Standup Notes — 28 April 2026</strong></p><ul><li><strong>Sudarshan:</strong> Completed login loading screen + onboarding tutorial. Working on skeleton loader.</li><li><strong>Meera:</strong> Token system v2 — in review.</li><li><strong>Arjun:</strong> PR #149 in review, ETA merge tomorrow.</li><li><strong>Karan:</strong> Investigating the drag-to-sort regression.</li></ul><p>No blockers raised. Next standup: 29 April, 9:30 AM.</p>`,
    smartReplies: ['Noted', 'See you tomorrow', 'Will update on the skeleton today'],
  },
  {
    id: 'f4', subject: 'Re: Can you review my portfolio?',
    from: { name: 'Aditya Verma', email: 'aditya.v@design.school', avatar: 'AV', color: '#8b5cf6' },
    to: [people[0]], account: 'primary',
    threadId: 'tf4', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [{ name: 'portfolio-aditya.pdf', size: '6.2 MB' }],
    timestamp: m(35),
    preview: "Hi Sudarshan, I'd really appreciate your feedback on my design portfolio before I apply to Figma...",
    body: `<p>Hi Sudarshan,</p><p>I know you're busy but I would really appreciate your feedback on my portfolio before I apply to the Figma design internship. I've attached the PDF version — it should take about 10 minutes to flip through.</p><p>Thanks so much,<br>Aditya</p>`,
    smartReplies: ['Happy to help!', "I'll take a look this week", 'Sure, send it over'],
  },
  {
    id: 'f5', subject: 'Product Hunt: Lucid Mail is trending — 142 upvotes',
    from: { name: 'Product Hunt', email: 'digest@producthunt.com', avatar: 'PH', color: '#da552f' },
    to: [people[0]], account: 'primary',
    threadId: 'tf5', isRead: false, isStarred: true, labels: ['inbox'],
    attachments: [],
    timestamp: m(42),
    preview: 'Your product "Lucid Mail" is trending on Product Hunt with 142 upvotes! It\'s currently #3 of the day.',
    body: `<p>Your product <strong>Lucid Mail</strong> is trending on Product Hunt!</p><p>Current rank: <strong>#3 Product of the Day</strong><br>Upvotes: <strong>142</strong><br>Comments: <strong>28</strong></p><p><a href="#">View your listing</a></p>`,
    smartReplies: ['Amazing!', 'Sharing on Twitter now', 'Thank you Product Hunt community!'],
  },
  {
    id: 'f6', subject: 'Budget approval needed — Q2 tooling spend',
    from: { name: 'Finance Team', email: 'finance@acme.corp', avatar: 'FT', color: '#0891b2' },
    to: [people[0]], account: 'work',
    threadId: 'tf6', isRead: false, isStarred: false, labels: ['inbox', 'work', 'finance'],
    attachments: [{ name: 'q2-budget-request.xlsx', size: '420 KB' }],
    timestamp: m(65),
    preview: 'Sudarshan, the Q2 tooling budget request requires your approval by 30 April. Total: Rs. 1,84,000.',
    body: `<p>Sudarshan,</p><p>The Q2 tooling budget request requires your sign-off by <strong>30 April 2026</strong>.</p><table style="border-collapse:collapse;margin-bottom:16px"><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Figma (team plan, 8 seats)</td><td style="padding:8px 0">Rs. 64,000</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Linear (team plan)</td><td style="padding:8px 0">Rs. 48,000</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Zoom Business (10 hosts)</td><td style="padding:8px 0">Rs. 72,000</td></tr><tr><td style="padding:8px 16px 8px 0;font-weight:600">Total</td><td style="padding:8px 0;font-weight:700">Rs. 1,84,000</td></tr></table><p><a href="#">Approve</a> | <a href="#">Request changes</a></p>`,
    smartReplies: ['Approved', 'Will review the details first', 'Sending feedback shortly'],
  },
  {
    id: 'f7', subject: 'You have a new follower on Twitter — @uxresearcher',
    from: { name: 'Twitter / X', email: 'notify@twitter.com', avatar: 'TX', color: '#1DA1F2' },
    to: [people[0]], account: 'primary',
    threadId: 'tf7', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(78),
    preview: '@uxresearcher (Sarah Johnson — UX Researcher at Google) is now following you on Twitter.',
    body: `<p><strong>@uxresearcher</strong> is now following you on X (Twitter).</p><p>Sarah Johnson · UX Researcher at Google · 4,821 followers</p><p><a href="#">Follow back</a> | <a href="#">View profile</a></p>`,
    smartReplies: [],
  },
  {
    id: 'f8', subject: 'Slack: You have 14 unread messages',
    from: { name: 'Slack', email: 'feedback@slack.com', avatar: 'SL', color: '#4A154B' },
    to: [people[0]], account: 'work',
    threadId: 'tf8', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(95),
    preview: '14 unread messages in #lucid-design, #general, and 2 DMs. Most recent: Karan Singh in #lucid-design.',
    body: `<p>You have <strong>14 unread messages</strong> across your Slack workspace.</p><ul><li>#lucid-design — 8 new messages</li><li>#general — 3 new messages</li><li>DM from Karan Singh — 2 messages</li><li>DM from Meera Pillai — 1 message</li></ul><p><a href="#">Open Slack</a></p>`,
    smartReplies: [],
  },
  {
    id: 'f9', subject: 'Re: Can we move the sprint review to Thursday?',
    from: people[1], to: [people[0]], account: 'work',
    threadId: 'tf9', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(108),
    preview: "Sure, Thursday works for me. I'll update the calendar invite. Any preference on timing — 3 PM or 4 PM?",
    body: `<p>Thursday works for me. Updating the calendar invite now.</p><p>Any preference on time — 3 PM or 4 PM? I have a client call at 5 PM so need a buffer.</p><p>— Arjun</p>`,
    smartReplies: ['3 PM works', '4 PM is better for me', 'Either is fine'],
  },
  {
    id: 'f10', subject: 'Vercel: Deployment failed — lucid-mail-beta',
    from: { name: 'Vercel', email: 'noreply@vercel.com', avatar: 'VC', color: '#000000' },
    to: [people[0]], account: 'work',
    threadId: 'tf10', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(115),
    preview: 'Deployment of lucid-mail-beta (commit a4f92b3) failed. Error: TypeScript build failed — 2 errors found.',
    body: `<p>Deployment of <strong>lucid-mail-beta</strong> failed.</p><p>Commit: <code>a4f92b3</code><br>Branch: <code>feat/skeleton-loader</code></p><pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-size:.8125rem">Error: Type 'string | undefined' is not assignable to type 'string'
  at src/components/ui/AppSkeleton.tsx:14:5</pre><p><a href="#">View full error log</a></p>`,
    smartReplies: ['On it', 'Will fix and redeploy', 'Checking the error now'],
  },
  {
    id: 'f11', subject: 'Designer News: This week\'s top HCI articles',
    from: { name: 'Designer News', email: 'weekly@designernews.co', avatar: 'DN', color: '#2196F3' },
    to: [people[0]], account: 'primary',
    threadId: 'tf11', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(200),
    preview: 'This week: The death of dark patterns. How Apple redesigned the Settings app. Why loading skeletons...',
    body: `<h3 style="margin:0 0 16px">Designer News Weekly</h3><ul style="line-height:2"><li><a href="#">The death of dark patterns in 2026</a></li><li><a href="#">How Apple redesigned the Settings app in 90 days</a></li><li><a href="#">Why loading skeletons beat spinners every time</a></li><li><a href="#">The psychology of empty states</a></li><li><a href="#">Microinteractions that users actually notice</a></li></ul>`,
  },
  {
    id: 'f12', subject: 'Your SaaS subscription renews in 7 days — Linear',
    from: { name: 'Linear', email: 'billing@linear.app', avatar: 'LN', color: '#5E6AD2' },
    to: [people[0]], account: 'work',
    threadId: 'tf12', isRead: false, isStarred: false, labels: ['inbox', 'work', 'finance'],
    attachments: [],
    timestamp: m(270),
    preview: 'Your Linear Team plan renews on 5 May 2026 for Rs. 4,000/month. Update payment method if needed.',
    body: `<p>Your <strong>Linear Team plan</strong> renews in 7 days.</p><p>Plan: Team (8 members)<br>Amount: Rs. 4,000/month<br>Renewal date: 5 May 2026</p><p><a href="#">Manage subscription</a> | <a href="#">Update payment method</a></p>`,
    smartReplies: ['Got it', 'Will update payment method', 'Please cancel'],
  },
  {
    id: 'f13', subject: 'New research collaboration invite — IIT Bombay',
    from: people[17], to: [people[0]], account: 'primary',
    threadId: 'tf13', isRead: false, isStarred: true, labels: ['inbox'],
    attachments: [{ name: 'research-brief-iitb.pdf', size: '2.1 MB' }],
    timestamp: m(310),
    preview: 'Sudarshan, our lab at IIT Bombay is looking for a collaborator on our email UX study. Would you be interested?',
    body: `<p>Dear Sudarshan,</p><p>Our HCI lab at IIT Bombay is conducting a study on email interface design patterns across 200 participants. Given your work on Lucid Mail, we would love to have you as a collaborator.</p><p>The study runs May–July 2026. Research brief attached.</p><p>Best,<br>Nadia</p>`,
    smartReplies: ["I'd love to!", 'This sounds exciting — will read the brief', 'Let me check my availability'],
  },
  {
    id: 'f14', subject: 'App Store: Lucid Mail rated 5 stars by 12 users',
    from: { name: 'Apple', email: 'no_reply@email.apple.com', avatar: 'AP', color: '#555555' },
    to: [people[0]], account: 'work',
    threadId: 'tf14', isRead: true, isStarred: true, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(400),
    preview: 'Your app "Lucid Mail" received 12 new ratings this week. Average: 4.9 stars. Top review: "Finally..."',
    body: `<p>Your app <strong>Lucid Mail</strong> received new ratings this week.</p><p>New ratings: <strong>12</strong><br>Average this week: <strong>4.9 ★</strong><br>All-time average: <strong>4.8 ★</strong></p><blockquote style="border-left:3px solid #ccc;padding-left:1rem;margin-left:0;color:#555">"Finally an email app that doesn't get in the way. The keyboard shortcuts are chef's kiss." — 5 stars</blockquote>`,
    smartReplies: ['So happy to see this!', 'Sharing with the team', 'Thank you, users!'],
  },
  {
    id: 'f15', subject: 'Reminder: HCI end-sem submission in 3 days',
    from: { name: 'Course Portal', email: 'portal@university.edu', avatar: 'CP', color: '#dc2626' },
    to: [people[0]], account: 'primary',
    threadId: 'tf15', isRead: false, isStarred: true, labels: ['inbox'],
    attachments: [],
    timestamp: m(440),
    preview: 'This is a reminder that your HCI end-semester project is due in 3 days (1 May 2026, 11:59 PM).',
    body: `<p>This is a reminder that your <strong>HCI End-Semester Project</strong> submission is due in <strong>3 days</strong>.</p><p>Deadline: <strong>1 May 2026, 11:59 PM</strong></p><p>Required items:<br>1. Working prototype (hosted URL or video)<br>2. HCI audit report<br>3. Reflection document (500 words)</p><p>Submit via the course portal.</p>`,
    smartReplies: ['Noted, almost done!', 'Will submit before the deadline', 'Can I get an extension?'],
  },
  {
    id: 'f16', subject: 'Re: Team lunch on Friday — confirmed Toit!',
    from: people[2], to: [people[0]], account: 'primary',
    threadId: 'tf16', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(500),
    preview: "Confirmed Toit for Friday, 1 PM. Booked a table for 6. Don't forget to try the mutton platter!",
    body: `<p>Toit is confirmed for Friday at 1 PM! I booked a table for 6. They have a new seasonal menu — I highly recommend the mutton platter.</p><p>Sarah</p>`,
    smartReplies: ['See you there!', 'Exciting!', 'Will be there'],
  },
  {
    id: 'f17', subject: 'GitHub: PR #149 approved and merged',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 'tf17', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(560),
    preview: 'Your pull request #149 "feat: skeleton loader for email list" has been approved by Karan and merged.',
    body: `<p>Pull request <a href="#">#149</a> has been <strong style="color:#34A853">merged</strong>.</p><p>Title: feat: skeleton loader for email list<br>Merged by: Karan Singh<br>Commits: 4 | Files changed: 6</p>`,
    smartReplies: ['Thanks for the review!', 'Onto the next one', 'Great!'],
  },
  {
    id: 'f18', subject: 'Your Swiggy order from The Bowl Company is confirmed',
    from: people[14], to: [people[0]], account: 'personal',
    threadId: 'tf18', isRead: true, isStarred: false, labels: ['inbox', 'personal', 'receipts'],
    attachments: [],
    timestamp: m(620),
    preview: 'Order confirmed: Quinoa Buddha Bowl × 1, Mango Lassi × 1 — Total Rs. 380. ETA: 35 minutes.',
    body: `<p>Your order from <strong>The Bowl Company</strong> is confirmed!</p><p>Quinoa Buddha Bowl × 1<br>Mango Lassi × 1<br>Delivery fee: Rs. 30<br><strong>Total: Rs. 380</strong><br>ETA: 35 minutes</p>`,
    smartReplies: ['Can\'t wait!', 'Thanks!'],
  },
  {
    id: 'f19', subject: 'Congratulations — you were shortlisted for the talk',
    from: { name: 'UX India 2026', email: 'speakers@uxindia.org', avatar: 'UX', color: '#6366f1' },
    to: [people[0]], account: 'primary',
    threadId: 'tf19', isRead: false, isStarred: true, labels: ['inbox'],
    attachments: [{ name: 'speaker-brief.pdf', size: '890 KB' }],
    timestamp: m(710),
    preview: 'We are delighted to inform you that your talk proposal "HCI in Email: Designing Lucid" has been shortlisted.',
    body: `<p>Dear Sudarshan,</p><p>We are delighted to inform you that your talk proposal <strong>"HCI in Email: Designing Lucid"</strong> has been shortlisted for UX India 2026.</p><p>Next step: Please confirm your availability by 5 May. A speaker brief is attached.</p><p>The UX India Team</p>`,
    smartReplies: ["I'd be honoured!", 'Confirming my availability', 'This is amazing!'],
  },
  {
    id: 'f20', subject: 'Your Amazon package was delivered',
    from: people[6], to: [people[0]], account: 'personal',
    threadId: 'tf20', isRead: true, isStarred: false, labels: ['inbox', 'personal'],
    attachments: [],
    timestamp: m(780),
    preview: 'Your Logitech MX Keys Mini has been delivered and left at your door. Rate your experience.',
    body: `<p>Your package has been <strong>delivered</strong>!</p><p>Item: Logitech MX Keys Mini<br>Delivered: 28 April 2026, 5:42 PM<br>Left at: Front door</p><p><a href="#">Rate your delivery</a></p>`,
  },
  {
    id: 'f21', subject: 'Weekly digest: What\'s new in React 20',
    from: { name: 'This Week in React', email: 'newsletter@thisweekinreact.com', avatar: 'RN', color: '#61DAFB' },
    to: [people[0]], account: 'primary',
    threadId: 'tf21', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(860),
    preview: 'React 20 RC2 released. Concurrent mode improvements. Server Components in production. Ink v4...',
    body: `<h3 style="margin:0 0 16px">This Week in React</h3><ul style="line-height:2"><li><a href="#">React 20 RC2 — concurrent rendering improvements</a></li><li><a href="#">Server Components hit production at Vercel</a></li><li><a href="#">Ink v4 — React for the terminal</a></li><li><a href="#">Why I migrated from Redux to Zustand</a></li></ul>`,
  },
  {
    id: 'f22', subject: 'Google: Storage summary for April 2026',
    from: people[7], to: [people[0]], account: 'primary',
    threadId: 'tf22', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(960),
    preview: 'You used 4.2 GB of your 15 GB Google storage in April. Gmail: 2.1 GB, Drive: 1.7 GB, Photos: 0.4 GB.',
    body: `<p>Your Google storage summary for April 2026:</p><table style="border-collapse:collapse;margin-bottom:16px"><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Gmail</td><td style="padding:8px 0">2.1 GB</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Drive</td><td style="padding:8px 0">1.7 GB</td></tr><tr><td style="padding:8px 16px 8px 0">Photos</td><td style="padding:8px 0">0.4 GB</td></tr></table>`,
  },
  {
    id: 'f23', subject: 'Customer support ticket #CST-8821 opened',
    from: { name: 'Support System', email: 'support@lucidmail.app', avatar: 'SS', color: '#059669' },
    to: [people[0]], account: 'work',
    threadId: 'tf23', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(1100),
    preview: 'New ticket: "Dark mode toggle doesn\'t save between sessions" — submitted by Vikram N. (beta user).',
    body: `<p>New support ticket submitted.</p><p><strong>#CST-8821</strong> — Dark mode toggle does not save between sessions<br>Priority: Medium<br>User: Vikram N. (beta tester)<br>Plan: Beta</p><blockquote style="border-left:3px solid #ccc;padding-left:1rem;margin-left:0;color:#555">"Every time I refresh the page, the app reverts to light mode even though I set dark mode. Using Chrome on Mac."</blockquote>`,
    smartReplies: ['Will investigate', 'Replying to the user now', 'Known issue — patching today'],
  },
  {
    id: 'f24', subject: 'Re: HCI course project ideas — your pick is great',
    from: people[10], to: [people[0]], account: 'primary',
    threadId: 'tf24', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(1250),
    preview: "Sudarshan, your choice of email client redesign is excellent. It's a rich problem space with plenty...",
    body: `<p>Sudarshan,</p><p>Your choice of email client redesign is excellent — it is a rich problem space with a strong prior art (Gmail, Superhuman, Hey) and 40 years of relevant HCI research to draw from.</p><p>Make sure your report clearly traces every design decision to a principle. See you in office hours!</p><p>Prof. Gupta</p>`,
    smartReplies: ['Thank you, Professor!', 'Will ensure every decision is justified', 'Appreciate the guidance'],
  },
  {
    id: 'f25', subject: 'Your GitHub Copilot trial ends in 5 days',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 'tf25', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(1350),
    preview: 'Your GitHub Copilot Individual trial ends on 3 May 2026. Subscribe to keep access.',
    body: `<p>Your <strong>GitHub Copilot</strong> free trial ends in <strong>5 days</strong>.</p><p>To continue using Copilot, subscribe for $10/month.</p><p><a href="#">Subscribe now</a> | <a href="#">Manage trial</a></p>`,
    smartReplies: ['Will subscribe', 'Cancelling after trial', 'Will decide later'],
  },
  {
    id: 'f26', subject: 'Reminder: Dental appointment tomorrow at 10 AM',
    from: { name: 'Smile Dental Clinic', email: 'reminders@smiledental.in', avatar: 'SD', color: '#0891b2' },
    to: [people[0]], account: 'personal',
    threadId: 'tf26', isRead: false, isStarred: false, labels: ['inbox', 'personal'],
    attachments: [],
    timestamp: m(1650),
    preview: 'Your appointment with Dr. Ritu Nair is confirmed for tomorrow, 29 April at 10:00 AM.',
    body: `<p>Appointment reminder:</p><p><strong>Dr. Ritu Nair</strong> (Orthodontist)<br>Date: 29 April 2026, 10:00 AM<br>Location: 42, Koramangala 4th Block</p><p>Please arrive 5 minutes early. Bring your X-rays if you have them.</p>`,
    smartReplies: ['Confirmed, see you then', 'Can I reschedule?', 'Will be there'],
  },
  {
    id: 'f27', subject: 'Stripe: New payout of Rs. 8,400 initiated',
    from: people[18], to: [people[0]], account: 'work',
    threadId: 'tf27', isRead: true, isStarred: false, labels: ['inbox', 'finance'],
    attachments: [{ name: 'payout-apr28.pdf', size: '64 KB' }],
    timestamp: m(1900),
    preview: 'A payout of Rs. 8,400 has been initiated to your HDFC account ending in 4821. ETA: 2 business days.',
    body: `<p>A payout of <strong>Rs. 8,400</strong> has been initiated.</p><p>Destination: HDFC Bank ····4821<br>ETA: 2 business days</p><p><a href="#">View payout</a></p>`,
  },
  {
    id: 'f28', subject: 'Notion: Priya shared "Q3 Product Roadmap" with you',
    from: people[9], to: [people[0]], account: 'work',
    threadId: 'tf28', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(2050),
    preview: 'Priya Sharma shared a Notion page: "Q3 Product Roadmap". You have commenting access.',
    body: `<p><strong>Priya Sharma</strong> shared a Notion page with you.</p><p>Page: <strong>Q3 Product Roadmap</strong><br>Access: Can comment</p><p><a href="#">Open in Notion</a></p>`,
    smartReplies: ['Will review and add comments', 'Thanks Priya!', 'Opening now'],
  },
  {
    id: 'f29', subject: 'Re: Should we adopt Tailwind v4 in the project?',
    from: people[16], to: [people[0]], account: 'work',
    threadId: 'tf29', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(2200),
    preview: "I say yes — the new CSS-first config is much cleaner and the bundle size reduction is significant...",
    body: `<p>I say yes. The new CSS-first config removes the need for a PostCSS plugin, the JIT is faster, and the bundle reduction is real — about 30% smaller in our internal tests.</p><p>The migration from v3 is mostly automated with the official codemod.</p><p>— Karan</p>`,
    smartReplies: ["Let's do it", "I'd like to do a spike first", 'Agreed, let\'s migrate'],
  },
  {
    id: 'f30', subject: 'Medium: Your article got 1,200 claps this week',
    from: { name: 'Medium', email: 'noreply@medium.com', avatar: 'MD', color: '#000000' },
    to: [people[0]], account: 'primary',
    threadId: 'tf30', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(2500),
    preview: 'Your article "10 HCI principles every developer should know" received 1,200 claps and 340 new followers.',
    body: `<p>Your article <strong>"10 HCI principles every developer should know"</strong> is performing well this week.</p><p>Claps: <strong>1,200</strong><br>New followers: <strong>340</strong><br>Views: <strong>8,400</strong><br>Reads: <strong>6,100</strong></p>`,
    smartReplies: ['Amazing response!', 'Will write a follow-up', 'Thanks for reading!'],
  },
  {
    id: 'f31', subject: 'Your electricity bill is ready — BESCOM April 2026',
    from: { name: 'BESCOM', email: 'ebill@bescom.org', avatar: 'BE', color: '#1565c0' },
    to: [people[0]], account: 'personal',
    threadId: 'tf31', isRead: false, isStarred: false, labels: ['inbox', 'finance', 'receipts'],
    attachments: [{ name: 'bill-april-2026.pdf', size: '280 KB' }],
    timestamp: m(3100),
    preview: 'Your electricity bill for April 2026 is Rs. 1,840. Due date: 15 May 2026. Pay online to avoid penalties.',
    body: `<p>Your electricity bill for April 2026 is ready.</p><p>Consumer No.: 4582910<br>Units consumed: 184<br>Amount: <strong>Rs. 1,840</strong><br>Due date: 15 May 2026</p><p><a href="#">Pay now</a> | <a href="#">Download bill</a></p>`,
    smartReplies: ['Will pay today', 'Scheduling payment', 'Paid online'],
  },
  {
    id: 'f32', subject: 'Re: Figma variables — are you using them in Lucid?',
    from: people[0], to: [people[12]], account: 'work',
    threadId: 'tf32', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(3400),
    preview: "Yes! We moved all spacing, colour, and typography tokens to Figma Variables in January. It's been...",
    body: `<p>Yes! We migrated all design tokens to Figma Variables in January — spacing, colour, and typography. The bi-directional sync with the codebase CSS variables is the biggest win.</p><p>Happy to do a short demo in the next design sync.</p><p>Sudarshan</p>`,
    smartReplies: [],
  },
  {
    id: 'f33', subject: 'Your Jira sprint velocity report is ready',
    from: people[19], to: [people[0]], account: 'work',
    threadId: 'tf33', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [{ name: 'velocity-sprint14.pdf', size: '190 KB' }],
    timestamp: m(3800),
    preview: 'Sprint 14 velocity: 42 story points. Planned: 48. Completion rate: 87.5%. Up from 74% in Sprint 13.',
    body: `<p><strong>Sprint 14 Velocity Report</strong></p><table style="border-collapse:collapse;margin-bottom:16px"><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Planned</td><td style="padding:8px 0">48 story points</td></tr><tr style="border-bottom:1px solid #eee"><td style="padding:8px 16px 8px 0">Completed</td><td style="padding:8px 0">42 story points</td></tr><tr><td style="padding:8px 16px 8px 0">Completion rate</td><td style="padding:8px 0;color:#34A853;font-weight:600">87.5% ↑</td></tr></table>`,
    smartReplies: ['Great improvement!', 'Sharing with the team', 'Will discuss in retro'],
  },
  {
    id: 'f34', subject: 'Ananya Gupta is calling you on Google Meet',
    from: people[10], to: [people[0]], account: 'primary',
    threadId: 'tf34', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(4100),
    preview: 'Prof. Ananya Gupta has started a video call. Join now: meet.google.com/xyz-abc-def',
    body: `<p><strong>Prof. Ananya Gupta</strong> is calling you on Google Meet.</p><p><a href="#">Join call — meet.google.com/xyz-abc-def</a></p>`,
    smartReplies: ['Joining now!', 'Be there in 2 minutes', 'Sorry, can we reschedule?'],
  },
  {
    id: 'f35', subject: 'Weekend read: "The humane inbox" by Basecamp',
    from: { name: 'Reeder', email: 'digest@reeder.app', avatar: 'RE', color: '#e85d04' },
    to: [people[0]], account: 'primary',
    threadId: 'tf35', isRead: true, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(4500),
    preview: 'Curated for you: The humane inbox (Basecamp). Flow state and email (Cal Newport). Loading UX patterns.',
    body: `<p>Your weekend reading list:</p><ul style="line-height:2"><li><a href="#">The humane inbox — Basecamp</a></li><li><a href="#">Flow state and email — Cal Newport</a></li><li><a href="#">Loading UX patterns that respect users</a></li><li><a href="#">Why Superhuman charges $30/month for email</a></li></ul>`,
  },
  {
    id: 'f36', subject: 'Deepika Rao reviewed your portfolio site',
    from: people[15], to: [people[0]], account: 'primary',
    threadId: 'tf36', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(4900),
    preview: "Sudarshan, I had a look at your portfolio. The case studies are strong but the about page needs more...",
    body: `<p>Sudarshan,</p><p>Your portfolio case studies are strong — especially the Lucid Mail one. A few notes:</p><ul><li>The About page needs a stronger hook in the first two sentences</li><li>Add a "view live" button to every project card</li><li>The mobile version breaks below 375px</li></ul><p>Overall, 8/10. Strong work!</p><p>Deepika</p>`,
    smartReplies: ['Thank you for the feedback!', 'Will fix those issues', 'Really appreciate this'],
  },
  {
    id: 'f37', subject: 'Your mobile plan auto-renewed — Jio',
    from: { name: 'Jio', email: 'noreply@jio.com', avatar: 'JI', color: '#0a3d91' },
    to: [people[0]], account: 'personal',
    threadId: 'tf37', isRead: true, isStarred: false, labels: ['inbox', 'finance', 'personal', 'receipts'],
    attachments: [],
    timestamp: m(5200),
    preview: 'Your Jio plan (3GB/day, unlimited calls) has been renewed for Rs. 299. Valid for 28 days.',
    body: `<p>Your Jio plan has been renewed.</p><p>Plan: 3GB/day + unlimited calls<br>Amount: Rs. 299<br>Validity: 28 days (expires 26 May 2026)</p>`,
  },
  {
    id: 'f38', subject: 'You\'ve been invited to a private Slack community — HCI Practitioners India',
    from: { name: 'Slack', email: 'feedback@slack.com', avatar: 'SL', color: '#4A154B' },
    to: [people[0]], account: 'primary',
    threadId: 'tf38', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [],
    timestamp: m(5600),
    preview: 'Prof. Ananya Gupta has invited you to join "HCI Practitioners India" on Slack (1,240 members).',
    body: `<p><strong>Prof. Ananya Gupta</strong> invited you to join <strong>HCI Practitioners India</strong> on Slack.</p><p>Members: 1,240<br>Focus: Applied HCI, usability research, and interface design in India</p><p><a href="#">Accept invitation</a></p>`,
    smartReplies: ['Accepted!', 'Joining now', 'Thanks for the invite'],
  },
  {
    id: 'f39', subject: 'Re: Should we add a chat feature to Lucid?',
    from: people[3], to: [people[0]], account: 'work',
    threadId: 'tf39', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(6100),
    preview: "Honestly, I think a minimal chat panel within the inbox could be really compelling. Think Gmail Chat...",
    body: `<p>Honestly, I think a minimal chat panel within the inbox could be very compelling — think Gmail Chat but done right. A right-side drawer, no new tab. The key is keeping it integrated without cluttering the email view.</p><p>We should spike it in Sprint 15.</p><p>Vikram</p>`,
    smartReplies: ['Agreed, let\'s spike it', 'I have reservations — scope creep risk', 'Interesting idea'],
  },
  {
    id: 'f40', subject: 'Your Figma file "Lucid UI Kit" was viewed 48 times this week',
    from: people[8], to: [people[0]], account: 'work',
    threadId: 'tf40', isRead: true, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(6500),
    preview: 'Your Figma file "Lucid UI Kit" was viewed 48 times this week by 12 unique editors across the team.',
    body: `<p>Your Figma file <strong>Lucid UI Kit</strong> weekly summary:</p><p>Views: <strong>48</strong><br>Unique editors: <strong>12</strong><br>Comments this week: <strong>7</strong><br>Most active frame: Email Row variants</p>`,
  },
  {
    id: 'f41', subject: 'BookMyShow: Dune 3 — booking confirmed',
    from: { name: 'BookMyShow', email: 'noreply@bookmyshow.com', avatar: 'BM', color: '#e83b44' },
    to: [people[0]], account: 'personal',
    threadId: 'tf41', isRead: true, isStarred: false, labels: ['inbox', 'travel', 'personal', 'receipts'],
    attachments: [{ name: 'tickets-dune3.pdf', size: '180 KB' }],
    timestamp: m(7100),
    preview: 'Booking confirmed: Dune 3 — Saturday, 3 May 2026, 7:00 PM. PVR Koramangala. 2 seats, Row G.',
    body: `<p>Your booking is confirmed!</p><p>Movie: <strong>Dune: Part Three</strong><br>Date: Saturday, 3 May 2026<br>Show: 7:00 PM<br>Venue: PVR Koramangala, Screen 3<br>Seats: G7, G8<br>Total: Rs. 640</p>`,
  },
  {
    id: 'f42', subject: 'Re: Peer feedback for HCI project',
    from: { name: 'Rohan Desai', email: 'rohan.desai@university.edu', avatar: 'RD', color: '#d97706' },
    to: [people[0]], account: 'primary',
    threadId: 'tf42', isRead: false, isStarred: false, labels: ['inbox'],
    attachments: [{ name: 'peer-feedback-lucid.pdf', size: '340 KB' }],
    timestamp: m(7600),
    preview: "Hi Sudarshan, great project! I especially liked how every UI decision links to a specific HCI principle...",
    body: `<p>Hi Sudarshan,</p><p>Really impressive project. A few comments:</p><ul><li>The login loading screen animation is clever — Gestalt closure applied well</li><li>The onboarding tutorial does a great job lowering the adoption barrier</li><li>Could add more personality to the empty state illustrations</li></ul><p>Overall: 9/10. Should be a top-scoring submission.</p><p>Rohan</p>`,
    smartReplies: ['Thank you, Rohan!', 'Will work on the empty states', 'Really appreciate this feedback'],
  },
  {
    id: 'f43', subject: 'HDFC Bank: UPI transaction alert',
    from: people[13], to: [people[0]], account: 'personal',
    threadId: 'tf43', isRead: true, isStarred: false, labels: ['inbox', 'finance', 'personal', 'receipts'],
    attachments: [],
    timestamp: m(8100),
    preview: 'Rs. 380 debited from your account ending 4821 via UPI to The Bowl Company. Ref: HDFC200847291.',
    body: `<p><strong>Debit alert</strong></p><p>Rs. 380 debited from account ····4821 via UPI.<br>To: The Bowl Company<br>Ref: HDFC200847291<br>Time: 28 Apr 2026, 1:14 PM</p><p>Not you? <a href="#">Report transaction</a></p>`,
  },
  {
    id: 'f44', subject: 'New issue opened in lucid-mail — LUCID-61',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 'tf44', isRead: false, isStarred: false, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(8800),
    preview: '[GitHub] Karan Singh opened issue #161: "Onboarding tutorial does not display on Firefox mobile".',
    body: `<p><strong>Karan Singh</strong> opened issue <a href="#">#161</a>:</p><h3 style="margin:.5rem 0">Onboarding tutorial does not display on Firefox mobile</h3><p><strong>Steps to reproduce:</strong><br>1. Open the app on Firefox for Android<br>2. Log in for the first time<br>3. Onboarding modal renders behind the skeleton layer</p><p><strong>Expected:</strong> Modal appears above everything<br><strong>Actual:</strong> Modal is hidden</p>`,
    smartReplies: ['Will investigate', 'Known issue — z-index fix incoming', 'Can you share a screenshot?'],
  },
  {
    id: 'f45', subject: 'You\'ve hit 500 GitHub stars — lucid-mail',
    from: people[5], to: [people[0]], account: 'work',
    threadId: 'tf45', isRead: false, isStarred: true, labels: ['inbox', 'work'],
    attachments: [],
    timestamp: m(9500),
    preview: 'Congratulations! Your repository lucid-mail just crossed 500 GitHub stars. 🌟',
    body: `<p>Congratulations! <strong>lucid-mail</strong> just crossed <strong>500 GitHub stars</strong>!</p><p>Stars: 501<br>Forks: 48<br>Watchers: 92<br>This week: +147 stars</p><p><a href="#">View repository</a></p>`,
    smartReplies: ['Absolutely thrilled!', 'Sharing this milestone!', 'Thank you, open source community!'],
  },
];

export const mockContacts: Person[] = mockEmails
  .map(e => e.from)
  .filter((v, i, arr) => arr.findIndex(p => p.email === v.email) === i)
  .filter(c => !['noreply@github.com', 'notifications@linkedin.com', 'noreply@swiggy.in', 'workspace@google.com', 'no-reply@figma.com', 'notify@notion.so'].includes(c.email));
