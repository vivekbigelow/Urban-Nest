export const v1SharedVariables = {
  // ── Brand Identity ──
  brand: {
    name: "Urban Nest",
    tagline: "Calm, credible, naturally welcoming.",
    mood: {
      humanWarmth: "Friendly, reassuring, approachable communication",
      groundedSecurity: "Sturdy containers, absolute safety, lease reliability",
      trustFirstExperience: "Clean, organized, straightforward interface",
    },
  },

  // ── Color Palette ──
  colors: {
    primary: "#315C4A", // Forest — core branding, high contrast buttons & accents
    accent: "#DDF277", // Fresh Lime — CTAs, highlights, trust badges, tag backgrounds
    secondary: "#FFB58F", // Human Warmth — testimonial card decorations & highlights
    background: "#F3F6EE", // Canvas — off-white with gentle welcoming green tint
    darkText: "#17201E", // Primary headings, subheadings, dark graphic parameters
    mutedText: "#86916E", // Body copy, form helpers, secondary metadata descriptions
    lightGreen: "#E8F0D4", // Pills & tags background
    white: "#FFFFFF", // Card container backgrounds
    darkSection: "#315C4A", // Dark section background (same as primary)
    darkSectionContent: "#D0E0CF", // Light Sage — dark section content text
    darkSectionContentAlt: "#FFFFFF", // Dark section alternate content text
    cardBorder: "#E4EAE1", // Card container border
  },

  // ── Typography ──
  typography: {
    fontFamily: "Inter",
    typeScale: {
      display: {
        role: "Display / H1",
        fontSize: "52px",
        fontWeight: "800", // Extra Bold
        letterSpacing: "-2px",
        lineHeight: "105%",
      },
      h2: {
        role: "Heading / H2",
        fontSize: "38px",
        fontWeight: "800", // Extra Bold
        letterSpacing: "-1.5px",
        lineHeight: "normal",
      },
      h3: {
        role: "Subheading / H3",
        fontSize: "34px",
        fontWeight: "800", // Extra Bold
        lineHeight: "normal",
      },
      bodyLarge: {
        role: "Body Large",
        fontSize: "17px",
        fontWeight: "400", // Regular
        lineHeight: "150%",
      },
      body: {
        role: "Body",
        fontSize: "15px",
        fontWeight: "400", // Regular
        lineHeight: "150%",
      },
      buttonLabel: {
        role: "Button Label",
        fontSize: "14px",
        fontWeight: "800", // Extra Bold
        textTransform: "uppercase",
      },
      caption: {
        role: "Caption / Small",
        fontSize: "13px",
        fontWeight: "400", // Regular
        lineHeight: "normal",
      },
    },
  },

  // ── Spacing & Radius ──
  spacing: {
    containerRadius: "22px", // All nested/standalone content components, UI cards, modular segments
    pillRadius: "999px", // Buttons, interactive categories, indicators, active status chips, tags
    philosophy:
      "Generous margins and white space for credibility, safety, and high-trust organization",
  },

  // ── Component Specs ──
  components: {
    primaryButton: {
      background: "#DDF277", // Lime accent
      textColor: "#315C4A", // Forest
      borderRadius: "999px", // Full pill shape
      fontWeight: "800", // Inter Extra Bold
      textTransform: "uppercase",
    },
    pillsAndTags: {
      background: "#E8F0D4", // Light Green
      textColor: "#315C4A", // Forest
      borderRadius: "999px", // Fully rounded
      fontWeight: "600", // Inter Bold/Semibold
    },
    cardContainer: {
      background: "#FFFFFF",
      borderRadius: "22px",
      border: "1px solid #E4EAE1",
      padding: "32px",
    },
    darkSection: {
      background: "#315C4A", // Forest
      contentTextColor: "#D0E0CF", // Light Sage
      headingTextColor: "#FFFFFF",
    },
  },
};
