export interface KBArticle {
  slug: string;
  title: string;
  summary: string;
  audience: "dealer" | "customer" | "both";
  category: string;
  content: string; // markdown-like sections using \n\n for paragraphs
}

export const kbArticles: KBArticle[] = [
  // ===== DEALER ARTICLES =====
  {
    slug: "getting-started-dealer",
    title: "Getting started as a dealer",
    summary: "How to set up your dealership, configure cover templates, and issue your first warranty.",
    audience: "dealer",
    category: "Getting Started",
    content: `## Welcome to WarrantyVault

Congratulations on joining WarrantyVault! This guide walks you through the essential first steps to start issuing self-funded warranties.

## Step 1: Log in to your Dealer Portal

After your application is approved, you'll receive an email with your login credentials. Head to the **Dealer Login** page and sign in.

## Step 2: Explore your Dashboard

Your dashboard gives you an at-a-glance view of:
- **Active warranties** and their statuses
- **Pending claims** that need your attention
- **Free warranty allocation** — you get 5 free warranties to start
- **Quick actions** like adding a warranty or looking up a vehicle

## Step 3: Set up Cover Templates

Before issuing warranties, create at least one cover template. Go to **Cover Templates** in the sidebar and define:
- **Covered items** — components fully covered (e.g., engine, gearbox)
- **Conditional items** — covered with conditions (e.g., turbo if under 80,000 miles)
- **Excluded items** — not covered (e.g., wear-and-tear items)

You can create multiple tiers like Bronze, Silver, and Gold.

## Step 4: Issue your first Warranty

Click **Add Warranty** and follow the 4-step wizard:
1. Enter the vehicle registration — details are auto-filled via DVLA
2. Add customer information (new or existing)
3. Select your cover template, duration, and price
4. Confirm payment (or use a free warranty)

The customer automatically receives a welcome email with their portal login.

## Step 5: Configure Claim Settings

Go to **Claim Settings** to set your maximum per-claim limit and labour rate cap. These help you manage costs consistently.

## What's next?

- Explore **Claim Assist** for AI-powered claim triage
- Set up your **Warranty Line** for a professional phone number
- Check your **Warranty Fund** dashboard to track revenue vs. claims`,
  },
  {
    slug: "issuing-warranty-step-by-step",
    title: "Issuing a warranty step by step",
    summary: "Walk through the 4-step warranty wizard: vehicle lookup, customer details, cover selection, and payment.",
    audience: "dealer",
    category: "Warranties",
    content: `## The Warranty Wizard

WarrantyVault uses a simple 4-step wizard to issue new warranties. Here's what happens at each step.

## Step 1: Vehicle Lookup

Enter the vehicle's registration number. WarrantyVault automatically looks up the vehicle via the DVLA database and fills in:
- Make and model
- Year of manufacture
- Engine details and fuel type

It also checks MOT history via DVSA to give you a complete picture of the vehicle's condition.

## Step 2: Customer Details

You have two options:
- **Existing customer** — Select from your customer list to auto-fill their details
- **New customer** — Enter their name, email, phone, and address manually

The customer will receive a welcome email with their portal login credentials.

## Step 3: Warranty Details

Configure the warranty:
- **Cover Template** — Choose from your predefined templates (Bronze, Silver, Gold, etc.)
- **Duration** — Select the warranty period (3, 6, 12, 24, or 36 months)
- **Cost** — Set the price. This is your revenue minus the £15 platform fee
- **Start date** — Defaults to today but can be adjusted
- **Notes** — Add any internal notes about the warranty

## Step 4: Payment

If you have free warranties remaining, the payment step is skipped entirely. Otherwise:
- Review the warranty summary
- Confirm the £15 platform fee
- The warranty is issued instantly

## After Issuing

- The warranty appears in your **Warranties** list immediately
- The customer receives a welcome email with portal access
- A warranty certificate is generated and available for download
- The audit log records the creation event`,
  },
  {
    slug: "managing-cover-templates",
    title: "Managing your cover templates",
    summary: "Create, edit, and manage what components are covered, conditionally covered, and excluded.",
    audience: "dealer",
    category: "Warranties",
    content: `## What are Cover Templates?

Cover templates define exactly what your warranty covers. Instead of setting coverage per warranty, you create reusable templates that can be applied to any warranty you issue.

## Creating a Template

Go to **Cover Templates** in your sidebar and click **Create Template**. You'll need to define:

### Covered Items
These are components that are fully covered under the warranty with no conditions. Common examples:
- Engine (internal components)
- Gearbox / Transmission
- Differential
- Steering rack
- Water pump

### Conditional Items
These are covered but only under certain conditions. For each conditional item, you specify the condition. Examples:
- Turbocharger — "Covered if vehicle is under 80,000 miles at warranty start"
- Air conditioning — "Covered if reported within first 30 days"

### Excluded Items
These are explicitly not covered. Being clear about exclusions prevents disputes. Common exclusions:
- Wear-and-tear items (brake pads, tyres, wiper blades)
- Cosmetic damage
- Modifications and aftermarket parts
- Pre-existing faults

## Template Tiers

Many dealers create multiple tiers to offer customers a choice:
- **Bronze** — Essential drivetrain components only
- **Silver** — Drivetrain plus electrical and cooling
- **Gold** — Comprehensive coverage including comfort systems

## Editing Templates

You can edit a template at any time. Changes apply to new warranties only — existing warranties keep the template version they were issued with.

## Metadata

Each template can store metadata like claim limits and labour rate overrides, giving you granular control per coverage level.`,
  },
  {
    slug: "free-warranty-allocations",
    title: "Understanding free warranty allocations",
    summary: "How the 5 free warranty system works and how to track your remaining allowance.",
    audience: "dealer",
    category: "Warranties",
    content: `## Your Free Warranties

Every new dealer on WarrantyVault receives **5 free warranties** to get started. This lets you try the platform without any financial commitment.

## How it Works

- When you issue a warranty and have free allocations remaining, the payment step is skipped entirely
- The system automatically tracks how many free warranties you've used
- Your remaining count is shown on your dashboard

## Tracking Usage

You can see your free warranty status in several places:
- **Dashboard** — The "Free Warranties" card shows remaining/total
- **Add Warranty wizard** — Step 4 shows if the warranty is free
- **Dealer Settings** — Full breakdown of your allocation

## After Your Free Allocation

Once you've used all 5 free warranties, each new warranty costs **£15** — a one-time platform fee per warranty. There are no monthly subscriptions or hidden charges.

## Important Notes

- Free warranties have the same features as paid ones — full portal access, certificates, claims support
- The £15 fee is per warranty issued, not per month
- There's no time limit on using your free allocation`,
  },
  {
    slug: "processing-managing-claims",
    title: "Processing and managing claims",
    summary: "How to review, approve, reject, and respond to customer claims from your dashboard.",
    audience: "dealer",
    category: "Claims",
    content: `## Claims Dashboard

When a customer submits a claim, it appears in your **Claims** section. Each claim shows:
- Customer name and vehicle details
- Issue description and supporting information
- Current status and priority level
- Full timeline of actions taken

## Claim Statuses

Claims move through these stages:
1. **Submitted** — The customer has filed the claim
2. **Under Review** — You're assessing the claim
3. **Info Requested** — You've asked the customer for more information
4. **Approved** — You've approved the claim for payment
5. **Rejected** — The claim doesn't meet the warranty terms

## Reviewing a Claim

When reviewing, consider:
- Is the reported issue covered under the warranty's cover template?
- Is the warranty still active and within its coverage period?
- Does the claim amount fall within your per-claim limit?
- Is the labour rate within your configured maximum?

## Taking Action

For each claim, you can:
- **Approve** — Authorise the repair and set the payment amount
- **Reject** — Decline with a reason (the customer sees the reason)
- **Request Info** — Ask the customer for more details, photos, or a garage report
- **Add Notes** — Record internal notes visible only to your team

## Claim Timeline

Every action is logged in the claim's timeline, creating a complete audit trail. This is invaluable if a dispute arises later.

## Tips for Efficient Claims Processing

- Set up **Claim Assist** to get AI-powered triage recommendations
- Configure claim limits and labour rates in **Claim Settings**
- Respond promptly — customers see the status in their portal in real time`,
  },
  {
    slug: "claim-assist-triage",
    title: "Using Claim Assist for faster triage",
    summary: "Let AI help you categorise and prioritise claims with recommended actions.",
    audience: "dealer",
    category: "Claims",
    content: `## What is Claim Assist?

Claim Assist is an AI-powered tool that helps you process claims faster and more consistently. It automatically analyses incoming claims and provides recommendations.

## How it Works

When a claim is submitted, Claim Assist:
1. **Categorises** the claim type (mechanical, electrical, cooling, etc.)
2. **Assesses priority** based on severity and vehicle drivability
3. **Checks coverage** against the warranty's cover template
4. **Recommends an action** — approve, investigate, or flag for review

## Using the Recommendations

Claim Assist's recommendations appear alongside each claim. You always make the final decision — the AI simply helps you work faster and catch things you might miss.

## Benefits

- **Consistency** — Every claim is assessed against the same criteria
- **Speed** — Reduce triage time from minutes to seconds
- **Coverage checks** — Automatic verification against the cover template
- **Priority flagging** — Urgent issues (e.g., vehicle not drivable) are highlighted

## Important Notes

- Claim Assist is a decision-support tool, not a decision-maker
- You can override any recommendation
- All decisions are logged in the audit trail regardless of AI involvement`,
  },
  {
    slug: "claim-limits-labour-rates",
    title: "Setting claim limits and labour rates",
    summary: "Configure maximum per-claim limits and labour rate caps in your claim settings.",
    audience: "dealer",
    category: "Claims",
    content: `## Claim Settings

Your claim settings let you configure financial guardrails that help you manage warranty costs consistently.

## Maximum Per-Claim Limit

This is the maximum amount you'll pay out on any single claim. For example, if set to £2,500:
- Claims under £2,500 can be approved for the full amount
- Claims over £2,500 are flagged for special review
- You can still approve higher amounts manually, but the system alerts you

## Maximum Labour Rate

This caps the hourly labour rate you'll accept on a claim. For example, if set to £75/hour:
- Garage invoices charging more than £75/hour are flagged
- This prevents inflated labour charges on repairs
- Different regions may justify different rates — adjust as needed

## How to Configure

1. Go to **Claim Settings** in your sidebar
2. Set your **Max Per-Claim Limit** (default: £2,500)
3. Set your **Max Labour Rate** (default: £75/hour)
4. Set your **Monthly Sales Target** for performance tracking
5. Changes take effect immediately for new claims

## Smart Contribution Mode

You can also choose how the system recommends warranty fund contributions:
- **Recommend** — The system suggests contribution amounts based on your claim history
- **Auto** — Contributions are calculated automatically
- **Manual** — You set contributions yourself`,
  },
  {
    slug: "disputeiq-complaint-resolution",
    title: "Using DisputeIQ for complaint resolution",
    summary: "How to use AI-powered dispute assessment to handle customer complaints under the Consumer Rights Act.",
    audience: "dealer",
    category: "DisputeIQ",
    content: `## What is DisputeIQ?

DisputeIQ is an AI-powered tool that helps you handle customer complaints professionally and in line with UK consumer law — specifically the **Consumer Rights Act 2015**.

## When to Use DisputeIQ

Use DisputeIQ when a customer raises a complaint about:
- A vehicle fault they believe was present at the time of sale
- A repair they're unhappy with
- A warranty claim decision they want to challenge
- Any situation that could escalate to a formal dispute

## Creating a Case

Click **New Case** in the DisputeIQ section and provide:
- **Customer details** — Name and vehicle registration
- **Sale and issue dates** — When the vehicle was sold and when the issue appeared
- **Mileage** — At sale and current
- **Complaint type** — Mechanical fault, electrical issue, cosmetic, etc.
- **Customer's summary** — What the customer is saying in their own words
- **Vehicle drivability** — Can the vehicle still be driven?
- **Warranty status** — Is there an active warranty?

## AI Assessment

DisputeIQ analyses the case and provides:
- **Risk level** — Low, medium, or high risk of escalation
- **Consumer Rights Act position** — Whether the customer's claim falls within the 30-day short-term right to reject, the 6-month reversal of burden of proof, or the standard position
- **Suggested stance** — Whether to be conciliatory, neutral, or firm
- **Key risks** — Specific risk factors to be aware of
- **Do nots** — Things to avoid saying or doing

## Response Options

DisputeIQ generates multiple response drafts:
- **Conciliatory** — Focused on resolution and goodwill
- **Balanced** — Professional and fair
- **Firm** — Asserting your position within legal bounds

You can select, edit, and personalise any response before sending.

## Important Disclaimer

DisputeIQ provides guidance based on common consumer law scenarios but is not a substitute for professional legal advice. For complex or escalated disputes, consult a legal professional.`,
  },
  {
    slug: "disputeiq-responses",
    title: "Editing and sending DisputeIQ responses",
    summary: "Select, customise, and send AI-generated responses to customers.",
    audience: "dealer",
    category: "DisputeIQ",
    content: `## Working with AI Responses

After DisputeIQ assesses your case, it generates multiple response options. Here's how to work with them.

## Selecting a Response

Each response is scored on:
- **Tone** — How conciliatory or firm the language is
- **Legal alignment** — How well it aligns with your CRA position
- **Resolution focus** — How strongly it pushes toward a resolution

Choose the response that best fits your situation and relationship with the customer.

## Editing the Response

You're never locked into the AI's exact wording. Use the built-in editor to:
- Adjust the tone to match your voice
- Add specific details about the vehicle or situation
- Reference previous conversations
- Include your proposed resolution

## Best Practices

- **Respond promptly** — Delays can escalate disputes
- **Be professional** — Even if the customer is frustrated
- **Document everything** — All responses are saved in the case file
- **Follow the "Do Nots"** — DisputeIQ flags common mistakes to avoid
- **Offer a clear next step** — Always end with a proposed action

## After Sending

The case status updates to reflect your response. You can:
- Add follow-up notes as the situation develops
- Record the outcome (resolved, escalated, etc.)
- Reference the case if the customer contacts you again`,
  },
  {
    slug: "warranty-fund-health",
    title: "Understanding your Warranty Fund health",
    summary: "Track revenue vs. claims, monitor reserves, and get smart contribution recommendations.",
    audience: "dealer",
    category: "Warranty Fund",
    content: `## What is the Warranty Fund?

The Warranty Fund dashboard gives you a real-time view of your self-funded warranty finances. It shows the balance between what you earn from warranties and what you pay out in claims.

## Key Metrics

- **Total Revenue** — Sum of all warranty prices you've charged customers
- **Total Claims Paid** — Sum of all approved claim amounts
- **Fund Balance** — Revenue minus claims (your reserve)
- **Health Score** — A percentage showing how healthy your reserve is

## Why it Matters

Self-funded warranties mean you're taking on the risk of claims. The Warranty Fund dashboard helps you:
- **Track profitability** — See if you're making more than you're paying out
- **Monitor reserves** — Ensure you have enough set aside for future claims
- **Spot trends** — See if claim rates are increasing over time
- **Plan pricing** — Adjust warranty prices based on actual claim data

## Smart Contributions

WarrantyVault can recommend how much of each warranty sale you should set aside as a claims reserve. The recommendation is based on:
- Your historical claim rate
- Average claim amount
- Number of active warranties
- Current fund balance

## Tips for a Healthy Fund

- Aim for a fund balance covering at least 3 months of average claims
- Review the fund dashboard monthly
- Adjust pricing if your claim rate exceeds 40% of revenue
- Consider using a claims excess to share costs with customers`,
  },
  {
    slug: "setting-up-warranty-line",
    title: "Setting up your Warranty Line",
    summary: "Configure your dedicated phone number, IVR menus, greetings, and call forwarding.",
    audience: "dealer",
    category: "Warranty Line",
    content: `## What is the Warranty Line?

The Warranty Line gives your dealership a dedicated phone number for warranty-related calls. It creates a professional experience for customers and separates warranty enquiries from your general sales line.

## Setting Up

Go to **Warranty Line** in your sidebar to configure:

### Business Details
- **Business name** — Shown in the greeting and IVR
- **Forwarding number** — Where calls are routed to

### Greeting Message
Customise what callers hear when they ring. For example:
"Thank you for calling [Your Dealership] warranty department. Your call is important to us."

### IVR Menu
Set up interactive voice response options:
- **Option 1** — e.g., "Press 1 for a new claim"
- **Option 2** — e.g., "Press 2 for an existing claim"
- **Option 3** — e.g., "Press 3 for general enquiries"

### Additional Options
- **Hold music** — Choose from default or custom options
- **Voicemail** — Enable voicemail with email notifications
- **Voicemail email** — Where voicemail recordings are sent

## Customer Experience

When you print warranty certificates or customers view their portal, the Warranty Line number is displayed prominently, giving them a clear and direct way to reach your warranty team.`,
  },
  {
    slug: "managing-customer-list",
    title: "Managing your customer list",
    summary: "View, search, and manage customers. Resend welcome emails and view customer warranties.",
    audience: "dealer",
    category: "Customers",
    content: `## Your Customer List

The **Customers** section shows all customers who have been issued warranties through your dealership.

## Viewing Customers

Each customer entry shows:
- Full name and email address
- Phone number and address (if provided)
- Number of warranties issued
- Date they were added

## Searching and Filtering

Use the search bar to find customers by:
- Name
- Email address
- Phone number

## Customer Actions

For each customer, you can:
- **View details** — See their full profile and warranty history
- **Resend welcome email** — Send their login credentials again if they've lost them
- **Add warranty** — Issue a new warranty directly for this customer

## Adding Customers

Customers are usually added automatically when you issue a warranty. You can also add customers manually before issuing a warranty, which is useful for pre-registration.

## Important Notes

- Customer email addresses must be unique per dealership
- Customers can only see their own warranties and claims in their portal
- You can update customer details at any time`,
  },
  {
    slug: "inviting-customers-portal",
    title: "Inviting customers to the portal",
    summary: "How customers receive access and how to resend invitation emails.",
    audience: "dealer",
    category: "Customers",
    content: `## Customer Portal Access

When you issue a warranty, the customer automatically receives a welcome email containing:
- A link to the customer login page
- Their email address (used as their username)
- A temporary password or password setup link

## Resending Welcome Emails

If a customer hasn't received their email or has lost it:
1. Go to **Customers** in your sidebar
2. Find the customer in the list
3. Click the **Resend Welcome Email** button
4. The customer receives a fresh email with their credentials

## What Customers See

Once logged in, customers can:
- View their warranty details and remaining coverage time
- See exactly what components are covered
- Download their warranty certificate as a PDF
- Submit warranty claims with descriptions and photos
- Track claim progress through the status tracker
- Submit requests for warranty extensions or detail updates

## Tips

- Mention the portal during the vehicle sale — customers appreciate the transparency
- Encourage customers to download their certificate and keep it with the vehicle
- The portal reduces inbound phone calls by giving customers self-service access`,
  },
  {
    slug: "dealer-dashboard-overview",
    title: "Dealer dashboard overview",
    summary: "Understanding your key metrics, performance indicators, and quick actions.",
    audience: "dealer",
    category: "Getting Started",
    content: `## Your Dashboard at a Glance

The dealer dashboard is your command centre. It shows everything you need to manage your warranty business.

## Key Metrics

- **Active Warranties** — Number of currently active policies
- **Expiring Soon** — Warranties expiring in the next 30 days
- **Pending Claims** — Claims waiting for your review
- **Total Revenue** — Sum of all warranty sales

## Quick Actions

From the dashboard, you can:
- **Add Warranty** — Jump straight to the warranty wizard
- **Look up a vehicle** — Quick reg check via DVLA
- **View pending claims** — Go to claims that need attention

## Free Warranty Tracker

If you have free warranties remaining, a prominent card shows your allocation:
- Used vs. total free warranties
- Visual progress bar

## Performance Section

In full mode (not Simple Mode), you'll see:
- Monthly revenue charts
- Claim rate statistics
- Warranty status breakdown
- Recent activity log

## Simple Mode

Toggle Simple Mode from the sidebar to show only the essentials — perfect for day-to-day use when you don't need the full analytics view.

## Notifications

The bell icon shows your unread notifications, including:
- New claims submitted
- Expiring warranties
- Customer requests
- System updates`,
  },
  {
    slug: "handling-customer-requests",
    title: "Handling customer requests",
    summary: "Review and respond to warranty extension, update, and cancellation requests.",
    audience: "dealer",
    category: "Customers",
    content: `## Customer Requests

Customers can submit requests through their portal for:
- **Warranty extension** — Requesting to extend their coverage period
- **Detail updates** — Changing address, phone number, or other details
- **Cancellation** — Requesting to cancel their warranty

## Viewing Requests

Go to **Requests** in your sidebar to see all pending and historical requests. Each request shows:
- Customer name and request type
- Description of what they're asking for
- Current status (pending, approved, rejected)
- Date submitted

## Responding to Requests

For each request, you can:
- **Approve** — Accept the request and take the appropriate action
- **Reject** — Decline with an optional reason

## Best Practices

- Respond within 48 hours to maintain good customer relationships
- For extension requests, consider offering a renewal at a discounted rate
- For cancellations, try to understand the reason — it may reveal an issue you can resolve
- All request actions are logged in your audit trail`,
  },

  // ===== CUSTOMER ARTICLES =====
  {
    slug: "accessing-warranty-portal",
    title: "Accessing your warranty portal",
    summary: "How to log in, find your credentials, and navigate your customer dashboard.",
    audience: "customer",
    category: "Getting Started",
    content: `## Logging In

When your dealer issues a warranty, you'll receive a welcome email with your login details. To access your portal:

1. Go to the **Customer Login** page
2. Enter your email address and password
3. Click **Sign In**

## Lost Your Credentials?

If you can't find your welcome email:
- Check your spam/junk folder
- Ask your dealer to **resend the welcome email** — they can do this from their system
- Use the **Forgot Password** link on the login page to reset your password

## Your Dashboard

Once logged in, you'll see your dashboard with:
- **Active warranty details** — Vehicle, coverage period, and days remaining
- **Coverage countdown** — A visual timer showing how long your warranty lasts
- **Quick actions** — View details, download certificate, submit a claim
- **Claim status** — If you've submitted a claim, track its progress here
- **What's covered** — A summary of your cover template

## Navigation

Use the sidebar to navigate between:
- **Dashboard** — Your overview page
- **My Warranty** — Full warranty details and certificate downloads
- **Your Cover** — Detailed breakdown of what's covered and excluded
- **Claims** — Submit and track warranty claims
- **Requests** — Submit warranty extension or update requests
- **Help & Guides** — Knowledge base articles and FAQs`,
  },
  {
    slug: "viewing-warranty-details",
    title: "Viewing your warranty details",
    summary: "See your vehicle information, coverage dates, remaining days, and what's covered.",
    audience: "customer",
    category: "Your Warranty",
    content: `## Your Warranty Information

Your warranty page shows everything about your coverage in one place.

## Vehicle Details

- **Make and model** — e.g., BMW 320d M Sport
- **Registration** — Your vehicle's reg number
- **Year** — Year of manufacture
- **Mileage** — Recorded at the time the warranty was issued

## Coverage Period

- **Start date** — When your warranty began
- **End date** — When your warranty expires
- **Days remaining** — A countdown showing exactly how long you have left
- **Duration** — Total warranty period (e.g., 12 months)

## Coverage Tier

Your warranty may show a tier badge (Bronze, Silver, or Gold) indicating the level of coverage. Higher tiers typically cover more components.

## Dealer Information

- **Dealer name** — The dealership that issued your warranty
- **Contact details** — How to reach your dealer if you need help

## Multiple Warranties

If you have more than one warranty (e.g., for different vehicles), they all appear in your portal. Each one shows its own status, details, and coverage.`,
  },
  {
    slug: "understanding-whats-covered",
    title: "Understanding what's covered",
    summary: "How to check which components are covered, conditionally covered, and excluded.",
    audience: "customer",
    category: "Your Warranty",
    content: `## Your Cover

Go to **Your Cover** in the sidebar to see a full breakdown of your warranty coverage.

## Covered Items ✅

These are components that are fully covered under your warranty. If any of these fail due to a mechanical or electrical fault, you can submit a claim. Common covered items include:
- Engine internal components
- Gearbox / transmission
- Steering system
- Cooling system

## Conditional Items ⚠️

These are covered but only under certain conditions. Each conditional item lists its specific condition. For example:
- "Turbocharger — covered if vehicle under 80,000 miles"
- "Air conditioning — covered if reported within 30 days"

Make sure you check the conditions before submitting a claim for these items.

## Excluded Items ❌

These are explicitly not covered by your warranty. Common exclusions include:
- Wear-and-tear items (brake pads, tyres, wiper blades, clutch)
- Cosmetic and bodywork damage
- Modifications and aftermarket parts
- Pre-existing faults known at the time of sale

## Important Notes

- Your coverage is determined by the template your dealer selected when issuing the warranty
- If you're unsure whether something is covered, check your cover page before submitting a claim
- You can always contact your dealer for clarification`,
  },
  {
    slug: "downloading-warranty-certificate",
    title: "Downloading your warranty certificate",
    summary: "How to download, print, or save your warranty certificate as a PDF.",
    audience: "customer",
    category: "Your Warranty",
    content: `## Your Warranty Certificate

Your warranty certificate is an official document confirming your coverage. It's useful to keep in the vehicle for garage visits or insurance purposes.

## How to Download

1. Go to your **Dashboard** or **My Warranty** page
2. Look for the **Download Certificate** button
3. Click it to generate and download a PDF

## What's on the Certificate

Your certificate includes:
- Your name and contact details
- Vehicle registration, make, model, and year
- Warranty start and end dates
- Duration of coverage
- Dealer name and details
- Unique warranty reference number

## Printing

After downloading, you can print the PDF using your computer or phone's standard print function. We recommend keeping a copy in the vehicle's glove box.

## Tips

- Download your certificate as soon as your warranty is issued
- If your garage asks about coverage, show them the certificate
- Your certificate reference number is useful when contacting your dealer about the warranty`,
  },
  {
    slug: "submitting-warranty-claim",
    title: "Submitting a warranty claim",
    summary: "Step-by-step guide to submitting a claim through your portal, including what information to provide.",
    audience: "customer",
    category: "Claims",
    content: `## How to Submit a Claim

If something goes wrong with your vehicle that you believe is covered by your warranty, you can submit a claim through your portal.

## Step-by-Step

1. Log in to your **Customer Portal**
2. Go to **Claims** in the sidebar
3. Click **Submit a Claim** or **New Claim**
4. Select the warranty the claim is for (if you have multiple)
5. Describe the issue in detail:
   - What happened?
   - When did you first notice the problem?
   - Is the vehicle still drivable?
   - Is the vehicle at a garage?
6. Click **Submit**

## What Happens Next

1. Your dealer receives a notification about your claim
2. They review the issue against your warranty's cover template
3. They may approve, reject, or ask you for more information
4. You can track the status on your claims page

## Tips for a Smooth Claim

- **Be specific** — Describe exactly what's wrong, not just "it's broken"
- **Note the mileage** — Current mileage helps with the assessment
- **Mention the garage** — If the vehicle is at a garage, include their name and contact
- **Check your cover** — Review your cover page before submitting to check the item is covered
- **Respond promptly** — If your dealer asks for more information, reply quickly to speed up the process

## Timelines

Claims are typically reviewed within 3–5 working days. You'll see the status update in real time on your claims page.`,
  },
  {
    slug: "tracking-claim-status",
    title: "Tracking your claim status",
    summary: "How to follow your claim through Submitted → Under Review → Decision stages.",
    audience: "customer",
    category: "Claims",
    content: `## Claim Status Tracker

After submitting a claim, you can track its progress on your **Claims** page.

## Status Stages

Your claim moves through these stages:

### 1. Submitted ⏳
Your claim has been received. Your dealer has been notified and will begin reviewing it.

### 2. Under Review 🔍
Your dealer is actively reviewing your claim. They're checking:
- Whether the issue is covered under your warranty
- The details you've provided
- Any supporting information needed

### 3. Decision ✅
Your dealer has made a decision:
- **Approved** — The claim has been accepted. Your dealer will arrange or reimburse the repair.
- **Rejected** — The claim wasn't covered. You'll see the reason why.
- **Info Requested** — Your dealer needs more information before deciding.

## Messages

If your dealer requests more information, you'll see it in the claim's message thread. You can reply directly from your portal.

## Timeline

Every claim has a detailed timeline showing:
- When it was submitted
- When the status changed
- Who took each action
- Any messages exchanged

## Multiple Claims

If you have multiple claims, each one is tracked independently. Your most recent claim appears on your dashboard for quick access.`,
  },
  {
    slug: "replying-information-requests",
    title: "Replying to information requests",
    summary: "What to do when your dealer asks for additional information on your claim.",
    audience: "customer",
    category: "Claims",
    content: `## When Your Dealer Needs More Info

Sometimes your dealer needs additional information to process your claim. When this happens:

1. Your claim status changes to **Info Requested** or **Awaiting Info**
2. You'll see a message from your dealer explaining what they need
3. A reply box appears in your claim details

## How to Reply

1. Go to your **Claims** page
2. Open the claim that needs a response
3. Go to the **Messages** tab
4. Type your response in the reply box
5. Click **Send Reply**

## What They Might Ask For

Common information requests include:
- **Photos** — Pictures of the fault, dashboard warning lights, or damage
- **Garage report** — A diagnostic report from a mechanic
- **More detail** — A clearer description of when and how the issue started
- **Mileage confirmation** — Current odometer reading

## Tips

- Respond as quickly as possible — delays slow down the claims process
- Be thorough — provide everything they've asked for in one reply if possible
- If you don't understand what they're asking, say so — they can clarify`,
  },
  {
    slug: "requesting-warranty-extension",
    title: "Requesting a warranty extension",
    summary: "How to submit a request to extend your warranty coverage.",
    audience: "customer",
    category: "Requests",
    content: `## Extending Your Warranty

If your warranty is approaching its end date and you'd like to extend coverage, you can submit a request through your portal.

## How to Request an Extension

1. Go to **Requests** in your sidebar
2. Click **New Request**
3. Select **Extension** as the request type
4. Describe your request (e.g., "I'd like to extend my warranty by 12 months")
5. Click **Submit**

## What Happens Next

Your dealer receives the request and will:
- Review the request based on the vehicle's condition and history
- Either approve or decline the extension
- If approved, issue a new warranty or extend the existing one

## Notes

- Extension requests are not automatically approved — your dealer makes the decision
- Your dealer may offer different pricing or coverage levels for renewals
- It's best to submit extension requests before your warranty expires
- You'll see the status of your request on the Requests page`,
  },
  {
    slug: "updating-your-details",
    title: "Updating your details",
    summary: "How to request changes to your contact information or vehicle details.",
    audience: "customer",
    category: "Requests",
    content: `## Keeping Your Details Up to Date

If your contact information or circumstances have changed, you can request an update through your portal.

## How to Request an Update

1. Go to **Requests** in your sidebar
2. Click **New Request**
3. Select **Update** as the request type
4. Describe what needs changing (e.g., "New phone number: 07xxx xxx xxx")
5. Click **Submit**

## What Can Be Updated

- Email address
- Phone number
- Home address
- Vehicle details (if applicable)

## Processing Time

Your dealer will review and process the update, usually within 1–2 working days. You'll see the request status change to **Approved** once it's done.`,
  },
  {
    slug: "resetting-password",
    title: "Resetting your password",
    summary: "How to reset your password if you've forgotten it, and what the requirements are.",
    audience: "both",
    category: "Account",
    content: `## Forgot Your Password?

If you've forgotten your password, you can reset it easily.

## How to Reset

1. Go to the **Login** page (Dealer or Customer)
2. Click **Forgot password?**
3. Enter your email address
4. Click **Send Reset Link**
5. Check your email for the reset link (check spam/junk too)
6. Click the link and set a new password

## Password Requirements

Your new password must meet all of these:
- ✅ At least **8 characters** long
- ✅ Contains at least one **uppercase letter** (A–Z)
- ✅ Contains at least one **lowercase letter** (a–z)
- ✅ Contains at least one **number** (0–9)

The password reset page shows green ticks as you meet each requirement, and confirms when both password fields match.

## Tips

- Use a unique password you don't use on other sites
- Consider using a password manager
- If the reset link doesn't arrive within 5 minutes, try again or check your spam folder
- Reset links expire after a set time — request a new one if needed`,
  },
  {
    slug: "contacting-your-dealer",
    title: "Contacting your dealer",
    summary: "How to reach your dealer through the warranty line or portal messages.",
    audience: "customer",
    category: "Support",
    content: `## Ways to Contact Your Dealer

There are several ways to reach your warranty dealer:

## 1. Warranty Line (Phone)

If your dealer has set up a Warranty Line, you'll see the phone number on:
- Your warranty certificate
- Your claims page
- The warranty line section of your portal

Call this number for warranty-related enquiries. You may hear an automated menu — just follow the prompts.

## 2. Through a Claim

If your issue is warranty-related, the best way to communicate is through the **claims system**:
- Submit a claim describing the issue
- Your dealer can reply with questions
- You can respond directly in the claim's message thread
- Everything is documented in one place

## 3. Through a Request

For non-claim issues (extensions, updates, cancellations), use the **Requests** feature to formally submit your enquiry.

## Tips

- For urgent issues (e.g., vehicle breakdown), call the Warranty Line if available
- For everything else, use the portal — it keeps a record of all communication
- Include your warranty reference number when contacting your dealer
- Be specific about your issue to get a faster response`,
  },
];

export const dealerCategories = ["Getting Started", "Warranties", "Claims", "DisputeIQ", "Warranty Fund", "Warranty Line", "Customers"];
export const customerCategories = ["Getting Started", "Your Warranty", "Claims", "Requests", "Account", "Support"];

export function getArticleBySlug(slug: string): KBArticle | undefined {
  return kbArticles.find(a => a.slug === slug);
}

export function getRelatedArticles(article: KBArticle, limit = 3): KBArticle[] {
  return kbArticles
    .filter(a => a.slug !== article.slug && (a.audience === article.audience || a.audience === "both") && a.category === article.category)
    .slice(0, limit);
}
