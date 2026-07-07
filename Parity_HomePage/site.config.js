const siteConfig = {
  brand: {
    name: "Pairity",
    tagline: "Emotional intelligence at scale",
    logoHtml: `
      <svg viewBox="0 0 52 40" class="w-10 h-8 text-primary">
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="3" />
        <circle cx="32" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="3" />
        <clipPath id="logo-clip">
          <circle cx="20" cy="20" r="18" />
        </clipPath>
        <circle cx="32" cy="20" r="18" fill="#d97706" clip-path="url(#logo-clip)" opacity="0.8" />
      </svg>
    `
  },
  theme: {
    primaryColor: "#091426",
    accentColor: "#8a4f39",
    backgroundColor: "#fbf9f5"
  },
  nav: [
    { label: "Learn", href: "pages/learn.html", relativeHref: "learn.html" },
    { label: "Upgrade", href: "pages/pricing.html", relativeHref: "pricing.html" },
    { label: "Support", href: "pages/support.html", relativeHref: "support.html" }
  ],
  hero: {
    headline: "Emotional intelligence at scale.",
    subheadline: "Reduce the anxiety of modern connection. Use AI to gain sanctuary-like clarity on your compatibility and emotional depth.",
    ctaPrimaryText: "Start Evaluation",
    ctaPrimaryLink: "pages/support.html",
    ctaSecondaryText: "How it works",
    ctaSecondaryLink: "pages/learn.html"
  },
  liveInsight: {
    icon: "insights",
    tag: "Live Compatibility Insight",
    text: "Synthesizing alignment on long-term values... emotional resonance detected at 92%."
  },
  journey: {
    title: "The Journey to Clarity",
    steps: [
      {
        stepNum: "Step 01",
        icon: "psychology",
        title: "Inward Reflection",
        description: "Answer deep-rooted psychological queries designed to map your emotional core without the noise.",
        themeClass: "bg-surface-container-low"
      },
      {
        stepNum: "Step 02",
        icon: "diversity_3",
        title: "Secure Bridge with Pairity AI",
        description: "Pairity UI then analyses your and partners answers without knowing your identity",
        themeClass: "bg-surface-container-high"
      },
      {
        stepNum: "Step 03",
        icon: "auto_awesome",
        title: "The Pairity Report",
        description: "Receive a comprehensive, AI-distilled analysis of your synergy, tension points, and growth areas.",
        themeClass: "bg-tertiary-fixed"
      }
    ]
  },
  domains: {
    title: "Holistic Domains",
    subtitle: "We evaluate compatibility across the fundamental pillars of human connection.",
    items: [
      "Financial Philosophies",
      "Conflict Resolution Style",
      "Family Values",
      "Intimacy Needs",
      "Social Recharge Rates",
      "Career Ambition Synergy"
    ]
  },
  privacySection: {
    tag: "The Sanctuary",
    title: "Privacy is our primary value.",
    description: "Your emotional data is your own. We use decentralized encryption to ensure that even our AI only sees patterns, never identities. A sanctuary for your most vulnerable self.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4cWvqDedDzrMzZzrCCqGGU5b-W8deRhBPI0FjP4k2diR0AWmYk7tqh9YxyADK4gMGTQIzMC3y6n0iQNGkPdvtbAoQciF0IcrTQJ-1Xk8CyyEHuS6DfiHH4CVGQ9wwnDOgw_f6JSVGxKX4lA-OzFqRqrkYA-zzhoBq2jISZKdSm9j7PF0YJestjm0Q9H3K80POmHgSwyzW9smOVbnCD0APs0GFFAtURmMOOGABJ1LT8SurUi2rBvdGuw",
    features: [
      "End-to-end encrypted sessions",
      "Zero-knowledge discovery",
      "GDPR & CCPA Compliant"
    ]
  },
  cta: {
    title: "Ready to bridge the gap?",
    description: "Join 50,000+ individuals seeking depth over surface-level interactions.",
    buttonText: "Begin Your Analysis"
  },
  footer: {
    links: [
      { label: "Learn", href: "pages/learn.html", relativeHref: "learn.html" },
      { label: "Privacy", href: "pages/privacy.html", relativeHref: "privacy.html" },
      { label: "Upgrade", href: "pages/pricing.html", relativeHref: "pricing.html" },
      { label: "Support", href: "pages/support.html", relativeHref: "support.html" },
      { label: "Terms", href: "pages/terms.html", relativeHref: "terms.html" }
    ],
    copyright: "© 2026 pairity. Emotional intelligence at scale."
  },
  pages: {
    learn: {
      title: "How Pairity Works",
      subtitle: "Navigating the complexities of human connection through the lens of psychological depth and AI precision.",
      methodology: {
        steps: [
          {
            title: "Inward Reflection",
            description: "Our AI-led interview process isn't a quiz; it's a conversation. We surface subconscious values and core beliefs that standard profiles often overlook.",
            icon: "psychology"
          },
          {
            title: "Secure Bridge with Pairity AI",
            description: "Pairity UI then analyses your and partners answers without knowing your identity",
            icon: "hub"
          },
          {
            title: "The Pairity Report",
            description: "A distilled synergy analysis that highlights common ground and surfaces potential friction points before they become obstacles.",
            icon: "summarize"
          }
        ]
      },
      privacyEthics: {
        title: "A Sanctuary for your Self",
        tag: "Privacy & Ethics",
        icon: "encrypted",
        features: [
          {
            title: "Decentralized Encryption:",
            description: "Your core data lives on your device, not our servers.",
            icon: "key"
          },
          {
            title: "Zero-Knowledge Discovery:",
            description: "We calculate compatibility without ever seeing your private answers.",
            icon: "visibility_off"
          },
          {
            title: "Ethical AI:",
            description: "Our models are trained on psychological research, not engagement hacks.",
            icon: "verified_user"
          }
        ]
      },
      domains: {
        title: "The Domains of Alignment",
        core: [
          {
            name: "Financial life",
            description: "Spending, saving, debt, and money values",
            icon: "payments",
            colorClass: "text-[#3b82f6]",
            tags: ["Spending style", "Savings goals", "Debt tolerance", "Joint accounts", "Financial risk"]
          },
          {
            name: "Children & parenting",
            description: "Whether, when, and how to raise kids",
            icon: "shopping_cart",
            colorClass: "text-[#10b981]",
            tags: ["Want children?", "Parenting style", "Child expenses", "Education values", "Discipline approach"]
          },
          {
            name: "Health & medical",
            description: "Wellness priorities and medical decisions",
            icon: "monitor_heart",
            colorClass: "text-[#ef4444]",
            tags: ["Health insurance", "Mental health", "Medical decisions", "Lifestyle habits", "Chronic illness"]
          },
          {
            name: "Career & ambition",
            description: "Work ethic, goals, and professional identity",
            icon: "work",
            colorClass: "text-[#d97706]",
            tags: ["Work-life balance", "Relocation openness", "Income priority", "Career sacrifices"]
          },
          {
            name: "Elderly care",
            description: "Responsibility for ageing parents and relatives",
            icon: "volunteer_activism",
            colorClass: "text-slate-905",
            tags: ["Financial support", "Caregiving duties", "Living arrangements", "Boundaries"]
          },
          {
            name: "Travel & lifestyle",
            description: "How you spend time and explore the world",
            icon: "flight",
            colorClass: "text-sky-600",
            tags: ["Travel frequency", "Adventure vs comfort", "Holiday budget", "Social life"]
          },
          {
            name: "Privacy & space",
            description: "Personal boundaries and autonomy within the couple",
            icon: "door_front",
            colorClass: "text-slate-800",
            tags: ["Alone time needs", "Phone privacy", "Friendships", "Social media"]
          }
        ],
        deeper: [
          {
            name: "Home & location",
            description: "Where and how you want to live",
            icon: "location_on",
            colorClass: "text-slate-800",
            tags: ["City vs rural", "Renting vs owning", "Relocation openness"]
          },
          {
            name: "Religion & spirituality",
            description: "Faith, rituals, and meaning-making",
            icon: "self_improvement",
            colorClass: "text-slate-850",
            tags: ["Religious practice", "Raising kids in faith", "Shared values"]
          },
          {
            name: "Intimacy & commitment",
            description: "Emotional and physical connection expectations",
            icon: "volunteer_activism",
            colorClass: "text-[#ef4444]",
            tags: ["Affection style", "Conflict resolution", "Relationship structure"]
          },
          {
            name: "Values & ethics",
            description: "Political, social, and moral worldviews",
            icon: "spa",
            colorClass: "text-emerald-700",
            tags: ["Political alignment", "Environmental values", "Social causes"]
          }
        ]
      },
      science: {
        title: "Quantifying Connection",
        tag: "SCIENTIFIC FRAMEWORK",
        badge: "AI GENERATED",
        score: "84%",
        alignmentLevel: "Strong",
        alignmentDesc: "Aligned on 6 of 7 domains",
        description: "Our \"Strong\" alignment score is calculated using weighted bayesian inference. We don't just look for \"similar\" answers—we evaluate the intensity of conviction and the long-term impact of potential divergence.",
        quote: "Pairity looks beyond the 'what' of your preferences to the 'why' of your needs, creating a holistic map of compatibility.",
        quoteIcon: "lightbulb"
      },
      cta: {
        title: "Ready for a deeper connection?",
        buttonText: "Start Your Reflection",
        priceNote: "Takes ~12 minutes. No credit card required."
      }
    },
    pricing: {
      title: "Upgrade Your Journey",
      subtitle: "Transcend the noise. Access deeper emotional insights and personalized compatibility mapping within our premium sanctuary.",
      plans: [
        {
          name: "Spark",
          description: "For curious couples taking a first look at their alignment.",
          price: "Free",
          frequency: "forever",
          priceNote: "No card required",
          features: [
            "2 of 11 Domains evaluated",
            "Domain-level alignment scores",
            "In-app report (view only)",
            "3 conversation starters",
            "1 session per account"
          ],
          buttonText: "Get Spark",
          isFeatured: false,
          icon: "bolt"
        },
        {
          name: "Bond",
          description: "For couples ready to go deep across every area of life.",
          price: "₹799",
          frequency: "session",
          priceNote: "One-time · no subscription",
          features: [
            "7 of 11 Domains evaluated",
            "Full AI insight paragraphs per domain",
            "In-app report (view only)",
            "2 AI conversation starters",
            "Flagged critical areas highlighted",
            "1-year report data retention"
          ],
          buttonText: "Get Bond",
          isFeatured: false,
          icon: "diversity_2"
        },
        {
          name: "Align",
          description: "For couples who want the deepest clarity, built to last.",
          price: "₹1,799",
          frequency: "year",
          priceNote: "3 sessions included · ~₹600 each",
          features: [
            "All 11 domains included",
            "Counsellor share link",
            "10 AI conversation starters",
            "AI follow-up Q&A after report",
            "Permanent data retention",
            "Re-take sessions after 3 months",
            "Priority email support"
          ],
          buttonText: "Get Align",
          isFeatured: true,
          icon: "auto_awesome"
        }
      ],
      comparison: {
        title: "Feature Comparison",
        headers: ["Feature", "Spark", "Bond", "Align"],
        groups: [
          {
            name: "Evaluation",
            rows: [
              { name: "Domains covered", spark: "2 of 11", bond: "7 of 11", align: "All 11", type: "text" },
              { name: "Questions per domain", spark: "8", bond: "8", align: "8 + custom weights", type: "text" },
              { name: "Sessions included", spark: "1", bond: "1", align: "3 / year", type: "text" },
              { name: "Re-take after 6 months", spark: "close", bond: "close", align: "check", type: "icon" }
            ]
          },
          {
            name: "Report",
            rows: [
              { name: "In-app report", spark: "check", bond: "check", align: "check", type: "icon" },
              { name: "AI insight paragraphs", spark: "close", bond: "check", align: "check", type: "icon" },
              { name: "PDF download", spark: "close", bond: "check", align: "check", type: "icon" },
              { name: "Conversation starters", spark: "3", bond: "5", align: "10", type: "text" },
              { name: "Critical areas flagged", spark: "close", bond: "check", align: "check", type: "icon" },
              { name: "Counsellor share link", spark: "close", bond: "close", align: "check", type: "icon" },
              { name: "AI follow-up Q&A", spark: "close", bond: "close", align: "check", type: "icon" }
            ]
          },
          {
            name: "Privacy & data",
            rows: [
              { name: "End-to-end encrypted", spark: "check", bond: "check", align: "check", type: "icon" },
              { name: "Data retention", spark: "30 days", bond: "1 year", align: "Permanent", type: "text" },
              { name: "Delete all data anytime", spark: "check", bond: "check", align: "check", type: "icon" }
            ]
          },
          {
            name: "Support",
            rows: [
              { name: "Support channel", spark: "Community", bond: "Email", align: "Priority email", type: "text" }
            ]
          }
        ]
      },
      brandingSection: {
        title: "A sanctuary for meaningful connection",
        description: "Join a community that values the weight of silence and the depth of emotional intelligence.",
        tag: "Pairity Branding",
        icon: "spa",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCX8NXdLNWoL6n5bPIHdeRez5WWOvJfMYbyo8ZMWtlA6pqGf6qUC1ACqJyRbbvWuCRjIA1rajGNuVGA7c58Sdz_sU3eaYXyMGplI8uj4VPs9imMijIoqJitLm63YpWJo9XbyXR9o8SHRPoaGSUvqwv3VPqJK2eKQCBo35nFo9Kmob_nZsdHMrPEj4_mb8YSxFontE-HnODq3ekcwwKTAOu4c_bsCszx6q5eRqqTgskVJkVULEN5p3gWqFCtAZZmcMfmekS9VmI2piSL"
      }
    },
    support: {
      title: "How can we help?",
      subtitle: "Find guidance, check FAQs, or reach out to our team of specialists.",
      searchPlaceholder: "Search for articles, guides...",
      categories: [
        { title: "Getting Started", description: "Basic setup and onboarding for your journey.", icon: "rocket_launch", colorClass: "bg-orange-50 text-[#8a4f39]" },
        { title: "The AI Interview", description: "How our depth-driven process actually works.", icon: "psychology", colorClass: "bg-emerald-50 text-emerald-700" },
        { title: "Privacy & Security", description: "Data encryption and our signature Zen Mode.", icon: "shield_lock", colorClass: "bg-slate-50 text-slate-900" },
        { title: "Billing & Premium", description: "Managing your Sanctuary subscription and tier.", icon: "subscriptions", colorClass: "bg-indigo-50 text-indigo-700" },
        { title: "Reading Your Report", description: "Understanding your emotional alignment scores.", icon: "bar_chart_4_bars", colorClass: "bg-orange-50 text-[#8a4f39]" },
        { title: "Account Settings", description: "Personal profile and secure data management.", icon: "settings_account_box", colorClass: "bg-slate-50 text-slate-900" }
      ],
      featuredArticles: [
        "Is my data really private?",
        "How to invite your partner",
        "Understanding the 24-hour reflection period"
      ],
      contact: {
        title: "Still need help?",
        description: "Our specialists and AI concierge are available 24/7 to support your relationship growth.",
        primaryCta: "Email us",
        secondaryCta: "Chat with AI Assistant",
        secondaryIcon: "smart_toy"
      }
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: July 2026",
      paragraphs: [
        "We prioritize your privacy above all. Your answers to compatibility queries are fully encrypted. We employ decentralized technology to analyze relationships metrics without revealing individual raw responses."
      ],
      sections: [
        { title: "Data Security", text: "All data is stored using zero-knowledge architecture. No third-party sharing, no tracking." }
      ]
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: July 2026",
      paragraphs: [
        "Welcome to Pairity. By using our website and services, you agree to these terms."
      ],
      sections: [
        { title: "Use of Service", text: "Users must provide accurate details and respect other members during private evaluations." }
      ]
    }
  }
};

// Export for browser
if (typeof module !== 'undefined') {
  module.exports = siteConfig;
} else {
  window.siteConfig = siteConfig;
}
