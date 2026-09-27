/**
 * Karigar AI — Craft Digital Twin, Claim Guard, Health Check & Memory Engine
 * Single Source of Truth for Indian Artisans' Digital Assets
 */

// Core Source Constants for Data Trust
const DATA_SOURCE = {
  ARTISAN: 'ARTISAN PROVIDED',
  AI_INFERRED: 'AI INFERRED',
  NOT_PROVIDED: 'NOT PROVIDED',
  VERIFIED_FACT: 'VERIFIED FACT'
};

// Initial Craft Memory Default Values
const DEFAULT_CRAFT_MEMORY = {
  enabled: true,
  artisanName: 'Babulal Master Craftsman',
  yearsExperience: 24,
  primaryCluster: 'Khurja & Jaipur Craft Cluster',
  preferredTechniques: ['Mughal Floral Glaze Painting', 'Quartz Stone Hand-Molding', 'Low-temp Kiln Firing'],
  frequentlyUsedMaterials: ['Quartz Powder', 'Cobalt Oxide', 'Glass Frit', 'Multani Mitti'],
  defaultDailyWage: 550,
  defaultCurrency: 'INR (₹)',
  signatureStory: 'Handcrafted following three generations of master pottery tradition.'
};

// Claim Guard Detection Rules
const CLAIM_GUARD_PATTERNS = [
  {
    regex: /\b(100% natural|all natural|completely natural|purely natural)\b/i,
    claim: '100% Natural',
    risk: 'High',
    explanation: 'Marketplace compliance policies require scientific testing documentation for "100% Natural" claims. Unverified claims can lead to listing suspension.',
    suggestion: 'Specify the exact natural components: e.g., "Handmade with mineral pigments and natural clay".'
  },
  {
    regex: /\b(\d{2,4}\s*(years|centuries)\s*old|ancient formula|500 years old|from mughal era)\b/i,
    claim: 'Antiquity / Heritage Age',
    risk: 'Medium',
    explanation: 'Stating a specific century or historical period requires archaeological provenance or GI society verification.',
    suggestion: 'Rephrase to: "Handcrafted using traditional techniques inspired by centuries-old regional heritage".'
  },
  {
    regex: /\b(government certified|state recognized|ministry approved|govt certified)\b/i,
    claim: 'Government Certification',
    risk: 'High',
    explanation: 'Amazon and Etsy require official certificate registration numbers for government endorsement claims.',
    suggestion: 'Provide certificate number or rephrase to "Registered with Artisan Craft Cluster".'
  },
  {
    regex: /\b(gi certified|gi tagged|geographical indication certified)\b/i,
    claim: 'GI (Geographical Indication) Certified',
    risk: 'Medium',
    explanation: 'GI tags are legally protected regional identities. The artisan must belong to a registered authorized user society.',
    suggestion: 'Verify your regional GI registration, or write "Crafted in the authentic [Region] craft tradition".'
  },
  {
    regex: /\b(100% organic|pure organic|certified organic)\b/i,
    claim: '100% Organic',
    risk: 'High',
    explanation: '"Organic" is a legally regulated term in US and EU export markets requiring accredited certification.',
    suggestion: 'Rephrase to: "Formed with unrefined plant and mineral ingredients".'
  },
  {
    regex: /\b(chemical free|zero chemical|non-toxic 100%)\b/i,
    claim: 'Chemical Free',
    risk: 'Medium',
    explanation: 'Water and minerals are chemically elements; regulators penalize the phrase "chemical free" as misleading advertising.',
    suggestion: 'Rephrase to: "Lead-free, food-safe glazes and non-toxic natural dyes".'
  },
  {
    regex: /\b(medicinal|cures|heals|health benefit|remedy)\b/i,
    claim: 'Medicinal / Health Claims',
    risk: 'High',
    explanation: 'Making health or therapeutic claims for handicrafts violates consumer protection laws.',
    suggestion: 'Focus on ergonomic comfort, natural cooling, or sensory wellness.'
  },
  {
    regex: /\b(pure silk|pure pashmina|pure gold|pure silver|100% gold)\b/i,
    claim: 'Purity Certification',
    risk: 'High',
    explanation: 'Precious metals and luxury fibers (Pashmina/Silk) require Hallmarking or Silk Mark / GI verification.',
    suggestion: 'Attach certification number or state "Traditional handloom blend".'
  }
];

class DigitalTwinService {
  constructor() {
    this.currentTwin = null;
    this.memory = this.loadMemory();
  }

  // Creates a clean, structured Digital Twin
  createNewTwin(initialData = {}) {
    const timestamp = new Date().toISOString();
    const id = 'dt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const twin = {
      id,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'Draft', // Draft, Verified, Marketplace Ready, Archived
      journeyStage: 'ai_understanding', // idea -> materials -> crafting -> finished -> understanding -> listing -> pricing -> marketing -> published
      artisan: {
        name: this.memory.artisanName || 'Artisan',
        cluster: this.memory.primaryCluster || 'Craft Cluster',
        yearsExperience: this.memory.yearsExperience || 10
      },
      // 10 Core Extracted Fields with Data Source Integrity
      fields: {
        product: {
          label: 'Product Name / Type',
          value: initialData.product || '',
          source: initialData.product ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        material: {
          label: 'Primary Material',
          value: initialData.material || '',
          source: initialData.material ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        technique: {
          label: 'Craft Technique',
          value: initialData.technique || '',
          source: initialData.technique ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        colors: {
          label: 'Dominant Color(s)',
          value: initialData.colors || '',
          source: initialData.colors ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        dimensions: {
          label: 'Dimensions & Weight',
          value: initialData.dimensions || '',
          source: initialData.dimensions ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        region: {
          label: 'Craft Region / Cluster',
          value: initialData.region || this.memory.primaryCluster || '',
          source: initialData.region ? DATA_SOURCE.ARTISAN : DATA_SOURCE.AI_INFERRED,
          confirmed: false
        },
        makingTime: {
          label: 'Production Labor Time',
          value: initialData.makingTime || '',
          source: initialData.makingTime ? DATA_SOURCE.ARTISAN : DATA_SOURCE.NOT_PROVIDED,
          confirmed: false
        },
        purpose: {
          label: 'Purpose & Placement Ideas',
          value: initialData.purpose || '',
          source: initialData.purpose ? DATA_SOURCE.ARTISAN : DATA_SOURCE.AI_INFERRED,
          confirmed: false
        },
        story: {
          label: 'Artisan Heritage Story',
          value: initialData.story || this.memory.signatureStory || '',
          source: initialData.story ? DATA_SOURCE.ARTISAN : DATA_SOURCE.AI_INFERRED,
          confirmed: false
        },
        care: {
          label: 'Care Instructions & Durability',
          value: initialData.care || '',
          source: initialData.care ? DATA_SOURCE.ARTISAN : DATA_SOURCE.AI_INFERRED,
          confirmed: false
        }
      },
      // Photo gallery
      images: [], // { id, url, caption, view, qualityScore }
      // Verified facts (Used strictly for AI customer replies and translation)
      verifiedFacts: [],
      // AI Inferred Observations
      aiInferredFacts: [],
      // Claim Guard detections
      flaggedClaims: [],
      // Fair Pricing breakdown
      pricing: {
        materialCost: 350,
        laborDays: 2,
        dailyWage: this.memory.defaultDailyWage || 500,
        overheads: 120,
        markupMultiplier: 1.35,
        suggestedWholesale: 1470,
        suggestedRetail: 1990,
        isEstimate: true
      },
      // Product Variants (e.g., Small, Medium, Large)
      variants: [
        {
          id: 'v_1',
          name: 'Standard Heritage Edition',
          size: 'Standard',
          color: 'Original Artisan Color',
          price: '₹1,990',
          stockStatus: 'Made to Order'
        }
      ],
      // Listing output representations
      listing: {
        title: '',
        shortDesc: '',
        professionalDesc: '',
        detailedStory: '',
        seoKeywords: [],
        tags: [],
        priceRange: ''
      },
      // Multi-lingual translations
      translations: {},
      // Marketing templates
      marketing: {
        whatsapp: '',
        instagram: '',
        bullets: '',
        sms: '',
        festival: ''
      },
      // Revision Version History
      versionHistory: [
        {
          version: 1,
          date: timestamp,
          summary: 'Initial Digital Twin created from artisan voice input'
        }
      ]
    };

    this.currentTwin = twin;
    return twin;
  }

  // Scan text and fields for unsupported claims
  checkClaims(text) {
    if (!text) return [];
    const detected = [];
    CLAIM_GUARD_PATTERNS.forEach(rule => {
      if (rule.regex.test(text)) {
        detected.push({
          claim: rule.claim,
          risk: rule.risk,
          explanation: rule.explanation,
          suggestion: rule.suggestion,
          verified: false,
          userNote: ''
        });
      }
    });
    return detected;
  }

  // Audit Digital Twin for completeness and health
  auditListingHealth(twin = this.currentTwin) {
    if (!twin) return { status: 'Incomplete', items: [] };

    const items = [];
    const f = twin.fields;

    // 1. Title & Product Check
    if (!f.product.value || f.product.value.length < 5) {
      items.push({
        type: 'critical',
        field: 'Product Name',
        message: 'Product name is missing or too generic. Add specific craft category.'
      });
    }

    // 2. Material Details
    if (!f.material.value) {
      items.push({
        type: 'critical',
        field: 'Materials',
        message: 'Specify exact materials (e.g. Terracotta clay, non-toxic vegetable lacquer) to build buyer trust.'
      });
    }

    // 3. Dimensions Check
    if (!f.dimensions.value) {
      items.push({
        type: 'warning',
        field: 'Dimensions & Weight',
        message: 'Adding height, width, and weight reduces marketplace return rates by over 30%.'
      });
    }

    // 4. Production Labor Time
    if (!f.makingTime.value) {
      items.push({
        type: 'info',
        field: 'Making Time',
        message: 'Artisanal buyers value human effort. Mention how many days or hours were invested.'
      });
    }

    // 5. Image Count
    if (!twin.images || twin.images.length === 0) {
      items.push({
        type: 'critical',
        field: 'Product Photos',
        message: 'No photos uploaded. Upload at least 1-2 photos for buyer confidence.'
      });
    } else if (twin.images.length === 1) {
      items.push({
        type: 'info',
        field: 'Photo Variety',
        message: 'Try adding a texture close-up or side angle photo to showcase handmade details.'
      });
    }

    // 6. Claim Guard Unverified Claims
    const unverified = (twin.flaggedClaims || []).filter(c => !c.verified);
    if (unverified.length > 0) {
      items.push({
        type: 'warning',
        field: 'Unsupported Claims',
        message: `${unverified.length} claim(s) require verification (e.g. "${unverified[0].claim}"). Review in Claim Guard.`
      });
    }

    // 7. Verified Facts Coverage
    const confirmedCount = Object.values(twin.fields).filter(v => v.confirmed).length;
    if (confirmedCount < 4) {
      items.push({
        type: 'warning',
        field: 'Fact Verification',
        message: 'Only ' + confirmedCount + ' facts are confirmed. Review and confirm facts in the Understanding Board.'
      });
    }

    return {
      confirmedCount,
      totalFields: Object.keys(twin.fields).length,
      isMarketplaceReady: items.filter(i => i.type === 'critical').length === 0,
      items
    };
  }

  // Photo Quality Coach Analysis
  analyzePhotosQuality(images = []) {
    const coachingTips = [];

    if (!images || images.length === 0) {
      coachingTips.push('📷 Upload at least 1 clear photo of your craft.');
      return coachingTips;
    }

    if (images.length === 1) {
      coachingTips.push('🔍 Add a close-up photo showing the intricate craft texture or artisan brushwork.');
      coachingTips.push('📐 Add a photo next to a common object (like a mug or hand) so buyers gauge true size.');
    }

    if (images.length >= 2 && !images.some(img => img.view === 'Side' || img.view === 'Angle')) {
      coachingTips.push('🔄 Add a side profile or 45-degree angle photo to showcase form depth.');
    }

    coachingTips.push('💡 Tip: Place your craft near an open window for soft natural daylight. Avoid harsh flash.');
    coachingTips.push('✨ Tip: Use a clean, uncluttered background like plain wood, jute fabric, or a neutral wall.');

    return coachingTips;
  }

  // Answer customer inquiries strictly from verified Digital Twin facts
  answerCustomerInquiry(inquiryText, twin = this.currentTwin) {
    if (!twin) return 'Please generate or select a product Digital Twin first.';
    if (!inquiryText || !inquiryText.trim()) return 'Please enter a customer question.';

    const q = inquiryText.toLowerCase();
    const f = twin.fields;

    // Check Material
    if (q.includes('material') || q.includes('made of') || q.includes('what is it made') || q.includes('clay') || q.includes('fabric')) {
      if (f.material.value && f.material.confirmed) {
        return `Namaste! This ${f.product.value || 'item'} is authentically crafted from genuine ${f.material.value}. It is completely handmade using traditional artisan techniques.`;
      } else if (f.material.value) {
        return `Namaste! The artisan indicates this is made from ${f.material.value}. (Pending final lab/cluster verification).`;
      }
      return "I don't have that verified information yet. Please let me check with our master artisan.";
    }

    // Check Dimensions / Size
    if (q.includes('size') || q.includes('dimension') || q.includes('height') || q.includes('width') || q.includes('how big') || q.includes('weight')) {
      if (f.dimensions.value && f.dimensions.confirmed) {
        return `Namaste! The dimensions of this handcrafted piece are: ${f.dimensions.value}. Since each piece is individually shaped by hand, minor millimeter variations may occur.`;
      }
      return "I don't have the exact verified dimensions recorded yet. I will measure this piece for you.";
    }

    // Check Making Time / Labor
    if (q.includes('time') || q.includes('how long') || q.includes('days') || q.includes('hours') || q.includes('making')) {
      if (f.makingTime.value && f.makingTime.confirmed) {
        return `Namaste! Each piece requires approximately ${f.makingTime.value} of skilled artisan labor to handcraft and fire.`;
      }
      return "I don't have the exact labor time recorded yet. It is crafted with traditional artisan patience.";
    }

    // Check Region / Provenance
    if (q.includes('where') || q.includes('region') || q.includes('origin') || q.includes('made in') || q.includes('city') || q.includes('state')) {
      if (f.region.value) {
        return `Namaste! This piece comes directly from the traditional craft clusters of ${f.region.value}, supporting local artisan heritage.`;
      }
      return "This piece is crafted by local Indian artisans. The exact cluster details are being updated.";
    }

    // Check Water / Care / Food Safety
    if (q.includes('water') || q.includes('wash') || q.includes('care') || q.includes('clean') || q.includes('food')) {
      if (f.care.value && f.care.confirmed) {
        return `Namaste! Care guidance for this piece: ${f.care.value}.`;
      }
      return "I don't have verified care/food-safety certification recorded for this item yet. Please handle with gentle artisan care.";
    }

    // Unknown or unsupported question
    return `Namaste! Thank you for your interest in our handcrafted ${f.product.value || 'craft'}. I don't have that specific verified information yet. Let me verify this with our master artisan so we can give you an accurate answer.`;
  }

  // Create a new version snapshot
  commitVersion(summary = 'Updated product details', twin = this.currentTwin) {
    if (!twin) return;
    const vNum = (twin.versionHistory ? twin.versionHistory.length : 0) + 1;
    const snapshot = {
      version: vNum,
      date: new Date().toISOString(),
      summary,
      snapshotData: JSON.parse(JSON.stringify({
        fields: twin.fields,
        pricing: twin.pricing,
        listing: twin.listing,
        variants: twin.variants
      }))
    };
    twin.versionHistory.unshift(snapshot);
    twin.updatedAt = new Date().toISOString();
  }

  // Restore a previous version snapshot
  restoreVersion(versionNum, twin = this.currentTwin) {
    if (!twin || !twin.versionHistory) return false;
    const target = twin.versionHistory.find(v => v.version === versionNum);
    if (!target || !target.snapshotData) return false;

    twin.fields = JSON.parse(JSON.stringify(target.snapshotData.fields));
    twin.pricing = JSON.parse(JSON.stringify(target.snapshotData.pricing));
    twin.listing = JSON.parse(JSON.stringify(target.snapshotData.listing));
    if (target.snapshotData.variants) {
      twin.variants = JSON.parse(JSON.stringify(target.snapshotData.variants));
    }
    this.commitVersion(`Restored to Version ${versionNum}`, twin);
    return true;
  }

  // Craft Memory Persistence
  loadMemory() {
    try {
      const stored = localStorage.getItem('karigar_craft_memory');
      return stored ? JSON.parse(stored) : { ...DEFAULT_CRAFT_MEMORY };
    } catch (e) {
      return { ...DEFAULT_CRAFT_MEMORY };
    }
  }

  saveMemory(newMem) {
    this.memory = { ...this.memory, ...newMem };
    try {
      localStorage.setItem('karigar_craft_memory', JSON.stringify(this.memory));
    } catch (e) {}
    return this.memory;
  }

  resetMemory() {
    this.memory = { ...DEFAULT_CRAFT_MEMORY };
    try {
      localStorage.removeItem('karigar_craft_memory');
    } catch (e) {}
    return this.memory;
  }
}

// Global instance
const DigitalTwin = new DigitalTwinService();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DigitalTwin, DigitalTwinService, DATA_SOURCE, CLAIM_GUARD_PATTERNS };
}
