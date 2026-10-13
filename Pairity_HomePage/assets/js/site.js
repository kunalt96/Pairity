document.addEventListener("DOMContentLoaded", () => {
  const config = window.siteConfig;
  if (!config) return;

  // Detect if current page is inside the "pages" subfolder
  const isSubpage = window.location.pathname.includes('/pages/') ||
    document.body.getAttribute('data-page-type') === 'subpage';
  const homePath = isSubpage ? "../index.html" : "index.html";
  const imagePath = isSubpage ? "../assets/images/image.png" : "assets/images/image.png";

  // Inject animations and styling rules dynamically to prevent blank loads on subpages
  const dynamicStyles = document.createElement('style');
  dynamicStyles.textContent = `
    .elastic-entrance {
        animation: elasticSlide 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
    }
    @keyframes elasticSlide {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .ai-pulse {
        animation: pulseOpacity 4s ease-in-out infinite;
    }
    @keyframes pulseOpacity {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
  `;
  document.head.appendChild(dynamicStyles);

  // Set document title if applicable
  const pageTitleElement = document.querySelector('title');
  if (pageTitleElement && pageTitleElement.hasAttribute('data-dynamic-title')) {
    const pageKey = pageTitleElement.getAttribute('data-dynamic-title');
    if (config.pages[pageKey]) {
      document.title = `${config.pages[pageKey].title} - ${config.brand.name}`;
    }
  }

  // Populate Logo & Nav Links (Desktop)
  const brandLogos = document.querySelectorAll(".brand-logo-container");
  brandLogos.forEach(el => {
    el.innerHTML = `
      <a href="${homePath}" class="flex items-center gap-2 cursor-pointer">
        ${config.brand.logoHtml}
        <span class="text-xl font-bold tracking-tight text-primary">${config.brand.name}</span>
      </a>
    `;
  });

  const desktopNav = document.getElementById("desktop-nav");
  if (desktopNav) {
    desktopNav.innerHTML = config.nav.map(item => `
      <a class="text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors" href="${isSubpage ? item.relativeHref : item.href}">${item.label}</a>
    `).join("");
  }

  // Populate Mobile Nav Link Panel
  const mobileMenuEl = document.getElementById("mobile-menu");
  if (mobileMenuEl) {
    mobileMenuEl.innerHTML = config.nav.map(item => `
      <a class="text-sm font-semibold text-on-surface-variant hover:text-secondary transition-colors" href="${isSubpage ? item.relativeHref : item.href}">${item.label}</a>
    `).join("");
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle && mobileMenuEl) {
    menuToggle.addEventListener('click', () => {
      mobileMenuEl.classList.toggle('hidden');
    });
  }

  // --- Dynamic Pages Rendering ---

  // 1. Home Page Render
  const heroContainer = document.getElementById("hero-section");
  if (heroContainer) {
    heroContainer.innerHTML = `
      <div class="elastic-entrance">
        <h1 class="font-headline-lg text-headline-lg md:text-5xl md:leading-tight text-primary mb-sm tracking-tight">${config.hero.headline}</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-[480px] mx-auto">${config.hero.subheadline}</p>
        <div class="flex flex-col sm:flex-row gap-sm justify-center">
          <a href="${isSubpage ? config.hero.ctaPrimaryLink.replace('pages/', '') : config.hero.ctaPrimaryLink}" class="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center">${config.hero.ctaPrimaryText}</a>
          <a href="${isSubpage ? config.hero.ctaSecondaryLink.replace('pages/', '') : config.hero.ctaSecondaryLink}" class="bg-transparent border border-outline-variant/30 text-primary px-lg py-sm rounded-full font-label-md text-label-md hover:bg-surface-container transition-all flex items-center justify-center">${config.hero.ctaSecondaryText}</a>
        </div>
      </div>
    `;
  }

  const dynamicVisualizationContainer = document.getElementById("dynamic-visualization-section");
  if (dynamicVisualizationContainer) {
    dynamicVisualizationContainer.innerHTML = `
      <div class="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-outline-variant/10 bg-slate-900 flex items-center justify-center">
        <img src="${imagePath}" class="absolute inset-0 w-full h-full object-cover" alt="Zen Harmony AI Visualization" />
        <div id="live-insight-card" class="absolute bottom-md left-md right-md bg-surface/85 backdrop-blur-xl p-md rounded-2xl border border-outline-variant/20 ai-pulse max-w-sm transition-all duration-300">
          <div class="flex justify-between items-start mb-xs">
            <div class="flex items-center gap-xs">
              <span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">${config.liveInsight.icon}</span>
              <span class="font-label-sm text-label-sm text-secondary uppercase tracking-widest">${config.liveInsight.tag}</span>
            </div>
            <button id="close-insight" class="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-sm">close</button>
          </div>
          <p class="font-body-md text-body-md text-on-surface italic">"${config.liveInsight.text}"</p>
        </div>
      </div>
    `;

    // Add close card logic
    const closeBtn = document.getElementById("close-insight");
    const insightCard = document.getElementById("live-insight-card");
    if (closeBtn && insightCard) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        insightCard.classList.add("hidden");
      });
    }
  }

  const journeyTitle = document.getElementById("journey-title");
  if (journeyTitle) journeyTitle.textContent = config.journey.title;

  const journeyStepsContainer = document.getElementById("journey-steps");
  if (journeyStepsContainer) {
    journeyStepsContainer.innerHTML = config.journey.steps.map(step => `
      <div class="${step.themeClass} p-md rounded-3xl border border-outline-variant/10 flex flex-col justify-between min-h-[320px] group hover:border-secondary/20 transition-all">
        <div>
          <div class="w-12 h-12 ${step.icon === 'diversity_3' ? 'bg-secondary text-on-secondary' : step.icon === 'auto_awesome' ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'} rounded-2xl flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
            <span class="material-symbols-outlined">${step.icon}</span>
          </div>
          <h3 class="font-headline-md text-headline-md text-primary mb-xs">${step.title}</h3>
          <p class="font-body-md text-body-md text-on-surface-variant">${step.description}</p>
        </div>
        <div class="mt-md ${step.icon === 'auto_awesome' ? 'text-on-tertiary-fixed-variant' : 'text-primary'} font-label-md flex items-center gap-xs">
          ${step.stepNum} <span class="w-8 h-px ${step.icon === 'auto_awesome' ? 'bg-on-tertiary-fixed-variant/30' : 'bg-outline-variant'}"></span>
        </div>
      </div>
    `).join("");
  }

  const domainsTitle = document.getElementById("domains-title");
  const domainsSubtitle = document.getElementById("domains-subtitle");
  const domainsList = document.getElementById("domains-list");

  if (domainsTitle) domainsTitle.textContent = config.domains.title;
  if (domainsSubtitle) domainsSubtitle.textContent = config.domains.subtitle;
  if (domainsList) {
    domainsList.innerHTML = config.domains.items.map(item => `
      <span class="bg-surface-container-highest px-md py-xs rounded-full text-primary font-label-md hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors cursor-default">${item}</span>
    `).join("");
  }

  const privacySection = document.getElementById("privacy-section");
  if (privacySection) {
    privacySection.innerHTML = `
      <div class="rounded-3xl overflow-hidden relative shadow-2xl h-[400px]">
        <img class="w-full h-full object-cover" alt="${config.privacySection.tag}" src="${config.privacySection.imageUrl}"/>
        <div class="absolute inset-0 bg-primary/10"></div>
      </div>
      <div class="space-y-md">
        <div class="inline-block px-xs py-1 border border-secondary text-secondary rounded-full font-label-sm text-label-sm uppercase tracking-widest">${config.privacySection.tag}</div>
        <h2 class="font-headline-lg text-headline-lg text-primary">${config.privacySection.title}</h2>
        <p class="font-body-lg text-body-lg text-on-surface-variant">${config.privacySection.description}</p>
        <ul class="space-y-sm">
          ${config.privacySection.features.map(feat => `
            <li class="flex items-center gap-xs font-label-md text-primary">
              <span class="material-symbols-outlined text-emerald-500">check_circle</span>
              ${feat}
            </li>
          `).join("")}
        </ul>
      </div>
    `;
  }

  const ctaContainer = document.getElementById("cta-section");
  if (ctaContainer) {
    ctaContainer.innerHTML = `
      <div class="bg-secondary-container p-xl rounded-[40px] relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-20 blur-3xl"></div>
        <h2 class="font-headline-lg text-headline-lg text-on-secondary-container mb-sm">${config.cta.title}</h2>
        <p class="font-body-md text-body-md text-on-secondary-container/80 mb-lg">${config.cta.description}</p>
        <a href="${isSubpage ? 'support.html' : 'pages/support.html'}" class="inline-block bg-primary text-on-primary px-xl py-sm rounded-full font-label-md text-label-md hover:scale-105 transition-all shadow-lg">${config.cta.buttonText}</a>
      </div>
    `;
  }

  // 2. Learn Page Render
  const learnContainer = document.getElementById("learn-page-container");
  if (learnContainer) {
    const learnData = config.pages.learn;
    learnContainer.className = "pt-32 pb-16 max-w-[800px] mx-auto px-6";
    learnContainer.innerHTML = `
      <!-- Hero Section -->
      <section class="elastic-entrance mb-16 text-center">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">${learnData.title}</h1>
        <p class="text-lg text-slate-500 max-w-[500px] mx-auto leading-relaxed">
          ${learnData.subtitle}
        </p>
      </section>

      <!-- The Methodology -->
      <section class="mb-16">
        <div class="space-y-8">
          ${learnData.methodology.steps.map(step => `
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-[#8a4f39]/10 flex items-center justify-center text-[#8a4f39]">
                  <span class="material-symbols-outlined font-semibold">${step.icon}</span>
                </div>
                <h3 class="text-xl font-bold text-slate-900">${step.title}</h3>
              </div>
              <p class="text-slate-500 text-sm pl-14">
                ${step.description}
              </p>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- Privacy & Ethics -->
      <section class="mb-16 p-6 rounded-2xl bg-[#f5f3ef] border border-slate-200">
        <div class="flex items-center gap-2 mb-4 text-[#8a4f39]">
          <span class="material-symbols-outlined text-sm font-semibold">${learnData.privacyEthics.icon}</span>
          <h2 class="text-xs font-bold uppercase tracking-widest">${learnData.privacyEthics.tag}</h2>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-4">${learnData.privacyEthics.title}</h3>
        <div class="space-y-4 text-slate-600 text-sm">
          ${learnData.privacyEthics.features.map(feat => `
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-slate-400" style="font-variation-settings: 'FILL' 1;">${feat.icon}</span>
              <p><strong class="text-slate-900 font-semibold">${feat.title}</strong> ${feat.description}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- The Domains of Alignment -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-slate-900 mb-8 text-center">${learnData.domains.title}</h2>
        
        <!-- Core Domains -->
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-450 mb-6">Core Domains</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          ${learnData.domains.core.map(item => `
            <div class="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col text-left shadow-sm hover:shadow-md transition-shadow">
              <div class="w-8 h-8 flex items-center justify-start ${item.colorClass || 'text-slate-800'} mb-2">
                <span class="material-symbols-outlined text-3xl font-semibold">${item.icon}</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 mt-2">${item.name}</h4>
              <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">${item.description}</p>
              <div class="flex flex-wrap gap-2 mt-auto">
                ${item.tags.map(tag => `
                  <span class="bg-[#f5f3ef] text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200/50">${tag}</span>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Deeper Domains -->
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-450 mb-6">Deeper Domains (Recommended additions)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${learnData.domains.deeper.map(item => `
            <div class="bg-white border border-slate-100 p-6 rounded-2xl flex flex-col text-left shadow-sm hover:shadow-md transition-shadow">
              <div class="w-8 h-8 flex items-center justify-start ${item.colorClass || 'text-slate-800'} mb-2">
                <span class="material-symbols-outlined text-3xl font-semibold">${item.icon}</span>
              </div>
              <h4 class="text-base font-bold text-slate-900 mt-2">${item.name}</h4>
              <p class="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">${item.description}</p>
              <div class="flex flex-wrap gap-2 mt-auto">
                ${item.tags.map(tag => `
                  <span class="bg-[#f5f3ef] text-slate-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-200/50">${tag}</span>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </section>

      <!-- The Science of the Report -->
      <section class="mb-16">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-xs font-bold text-slate-400 tracking-wider uppercase">${learnData.science.tag}</p>
              <h2 class="text-xl font-bold text-slate-900 mt-1">${learnData.science.title}</h2>
            </div>
            <div class="px-3 py-1 rounded-full bg-[#8a4f39]/10 text-[#8a4f39] text-xs font-bold">${learnData.science.badge}</div>
          </div>
          <div class="flex items-center gap-6 mb-6">
            <div class="relative w-20 h-20 flex items-center justify-center">
              <svg class="w-full h-full -rotate-90">
                <circle class="text-slate-100" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-width="6"></circle>
                <circle class="text-[#8a4f39]" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-dasharray="213" stroke-dashoffset="34" stroke-width="6"></circle>
              </svg>
              <span class="absolute text-lg font-bold text-slate-900">${learnData.science.score}</span>
            </div>
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wide">Overall Alignment</p>
              <p class="text-xl font-bold text-slate-900 leading-none mt-1">${learnData.science.alignmentLevel}</p>
              <p class="text-sm text-slate-500 mt-1.5">${learnData.science.alignmentDesc}</p>
            </div>
          </div>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">
            ${learnData.science.description}
          </p>
          <div class="p-4 rounded-xl bg-slate-50 flex gap-4 items-start border-l-4 border-[#8a4f39]">
            <span class="material-symbols-outlined text-[#8a4f39] mt-0.5" style="font-variation-settings: 'FILL' 1;">${learnData.science.quoteIcon}</span>
            <p class="text-sm italic text-slate-600">
              "${learnData.science.quote}"
            </p>
          </div>
        </div>
      </section>
    `;
  }

  // 3. Pricing (Upgrade) Page Render
  const pricingContainer = document.getElementById("pricing-page-container");
  if (pricingContainer) {
    const pricingData = config.pages.pricing;
    pricingContainer.innerHTML = `
      <!-- Hero Section -->
      <section class="text-center mb-xl">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">${pricingData.title}</h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">${pricingData.subtitle}</p>
      </section>

      <!-- Pricing Cards -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        ${pricingData.plans.map(plan => `
          <div class="bg-white border border-slate-100 rounded-3xl p-10 flex flex-col items-center text-center transition-all hover:shadow-lg duration-300 relative overflow-hidden group">
            ${plan.isFeatured ? `<div class="absolute top-4 right-6 bg-[#ffdbcf] text-[#8a4f39] px-3.5 py-1 rounded-full font-semibold text-xs uppercase tracking-wider">Most popular</div>` : ''}
            <div class="w-16 h-16 ${plan.isFeatured ? 'bg-orange-50 text-[#8a4f39]' : 'bg-slate-50 text-slate-900'} rounded-full flex items-center justify-center mb-6">
              <span class="material-symbols-outlined text-3xl font-semibold">${plan.icon}</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">${plan.name}</h2>
            <div class="flex flex-col items-center mb-6">
              <div class="flex items-baseline">
                <span class="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span class="text-slate-400 text-sm ml-1">/ ${plan.frequency}</span>
              </div>
              ${plan.priceNote ? `<p class="text-xs text-slate-450 mt-1">${plan.priceNote}</p>` : ''}
            </div>
            <ul class="text-left w-full space-y-4 mb-8 flex-grow">
              ${plan.features.map(feat => `
                <li class="flex items-center gap-3 text-slate-600 text-sm">
                  <span class="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <span class="material-symbols-outlined text-xs font-bold">check</span>
                  </span>
                  ${feat}
                </li>
              `).join("")}
            </ul>
            <button class="w-full py-3.5 px-6 rounded-full font-semibold text-sm ${plan.isFeatured ? 'bg-[#8a4f39] text-white hover:bg-opacity-95' : 'bg-[#091426] text-white hover:bg-opacity-95'} transition-all active:scale-[0.98]">
              ${plan.buttonText}
            </button>
          </div>
        `).join("")}
      </section>

      <!-- Feature Comparison Table -->
      <section class="mb-16 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-left">
        <h3 class="text-xl font-bold text-slate-900 mb-6 text-center">${pricingData.comparison.title}</h3>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">${pricingData.comparison.headers[0]}</th>
                <th class="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">${pricingData.comparison.headers[1]}</th>
                <th class="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">${pricingData.comparison.headers[2]}</th>
                <th class="text-center py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">${pricingData.comparison.headers[3]}</th>
              </tr>
            </thead>
            <tbody class="text-sm text-slate-600">
              ${pricingData.comparison.groups.map(group => `
                <tr class="bg-slate-50/70 border-b border-slate-100">
                  <td colspan="4" class="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">${group.name}</td>
                </tr>
                ${group.rows.map((row, idx) => `
                  <tr class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/20' : ''}">
                    <td class="py-4 px-4 font-medium text-slate-700">${row.name}</td>
                    <td class="text-center py-4">${row.spark === 'close' ? '<span class="material-symbols-outlined text-rose-400 font-bold text-base">close</span>' : row.spark === 'check' ? '<span class="material-symbols-outlined text-emerald-500 font-bold text-base">check</span>' : row.spark}</td>
                    <td class="text-center py-4 font-semibold text-[#091426]">${row.bond === 'close' ? '<span class="material-symbols-outlined text-rose-400 font-bold text-base">close</span>' : row.bond === 'check' ? '<span class="material-symbols-outlined text-emerald-500 font-bold text-base">check</span>' : row.bond}</td>
                    <td class="text-center py-4 font-semibold text-[#8a4f39]">${row.align === 'close' ? '<span class="material-symbols-outlined text-rose-400 font-bold text-base">close</span>' : row.align === 'check' ? '<span class="material-symbols-outlined text-emerald-500 font-bold text-base">check</span>' : row.align}</td>
                  </tr>
                `).join("")}
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  // 4. Privacy Page Render
  const privacyPageContainer = document.getElementById("privacy-page-container");
  if (privacyPageContainer) {
    const privacyData = config.pages.privacy;
    privacyPageContainer.innerHTML = `
      <h1 class="text-4xl font-bold text-primary mb-6">${privacyData.title}</h1>
      <p class="text-on-surface-variant mb-6">${privacyData.lastUpdated}</p>
      <div class="prose text-on-surface-variant space-y-6">
        ${privacyData.paragraphs.map(p => `<p>${p}</p>`).join("")}
        ${privacyData.sections.map(sec => `
          <h2 class="text-xl font-bold text-primary">${sec.title}</h2>
          <p>${sec.text}</p>
        `).join("")}
      </div>
    `;
  }

  // 5. Terms Page Render
  const termsContainer = document.getElementById("terms-page-container");
  if (termsContainer) {
    const termsData = config.pages.terms;
    termsContainer.innerHTML = `
      <h1 class="text-4xl font-bold text-primary mb-6">${termsData.title}</h1>
      <p class="text-on-surface-variant mb-6">${termsData.lastUpdated}</p>
      <div class="prose text-on-surface-variant space-y-6">
        ${termsData.paragraphs.map(p => `<p>${p}</p>`).join("")}
        ${termsData.sections.map(sec => `
          <h2 class="text-xl font-bold text-primary">${sec.title}</h2>
          <p>${sec.text}</p>
        `).join("")}
      </div>
    `;
  }

  // 6. Support Page Render
  const supportContainer = document.getElementById("support-page-container");
  if (supportContainer) {
    const supportData = config.pages.support;
    supportContainer.className = "pt-32 pb-16 max-w-[600px] mx-auto px-6";
    supportContainer.innerHTML = `
      <!-- Hero Section -->
      <section class="mb-12 text-center elastic-entrance">
        <h1 class="text-4xl font-bold text-slate-900 mb-4">${supportData.title}</h1>
        <p class="text-lg text-slate-500 max-w-[500px] mx-auto leading-relaxed">
          ${supportData.subtitle}
        </p>
      </section>

      <!-- Contact Section -->
      <section class="mb-12">
        <div class="flex flex-col gap-4 items-center py-6">
          <div class="w-full max-w-sm space-y-4">
            ${supportData.actions.map(action => {
              if (action.isSpecial) {
                return `
                  <a href="${action.href}" class="w-full p-5 bg-[#ffdbcf] border border-[#8a4f39] rounded-2xl flex items-center justify-between group hover:brightness-105 transition-all active:scale-95 block">
                    <div class="flex items-center gap-4">
                      <span class="material-symbols-outlined text-[#8a4f39] text-2xl font-semibold">${action.icon}</span>
                      <div class="flex flex-col items-start">
                        <span class="text-base font-bold text-[#370e01]">${action.title}</span>
                        ${action.description ? `<span class="text-xs text-slate-500 mt-0.5">${action.description}</span>` : ''}
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-[#370e01] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                `;
              } else {
                return `
                  <a href="${action.href}" target="_blank" rel="noopener noreferrer" class="w-full p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-[#8a4f39]/20 transition-all active:scale-95 shadow-sm block">
                    <div class="flex items-center gap-4">
                      <span class="material-symbols-outlined text-[#8a4f39] text-2xl font-semibold">${action.icon}</span>
                      <div class="flex flex-col items-start">
                        <span class="text-base font-semibold text-slate-800">${action.title}</span>
                        <span class="text-xs text-slate-400 mt-0.5">${action.description}</span>
                      </div>
                    </div>
                    <span class="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </a>
                `;
              }
            }).join("")}
          </div>
        </div>
      </section>
    `;
  }

  // Populate / Create Common Footer Section
  let footerContainer = document.getElementById("footer-section");
  if (!footerContainer) {
    footerContainer = document.querySelector("footer");
    if (!footerContainer) {
      footerContainer = document.createElement("footer");
      footerContainer.id = "footer-section";
      document.body.appendChild(footerContainer);
    }
  }

  if (footerContainer) {
    footerContainer.className = "bg-surface dark:bg-surface w-full py-16 border-t border-slate-200/55 mt-16";
    footerContainer.innerHTML = `
      <div class="max-w-[600px] mx-auto px-6 text-center">
        <div class="flex items-center gap-2 justify-center mb-4">
          ${config.brand.logoHtml}
          <span class="font-headline-md text-headline-md font-bold text-primary">${config.brand.name}</span>
        </div>
        <nav class="flex flex-wrap justify-center gap-6 mb-4">
          ${config.footer.links.map(link => `
            <a class="text-xs font-semibold tracking-wider text-on-surface-variant hover:text-secondary transition-colors inline-block hover:-translate-y-px" href="${isSubpage ? link.relativeHref : link.href}">${link.label}</a>
          `).join("")}
        </nav>
        <p class="text-xs text-on-surface-variant/60">${config.footer.copyright}</p>
      </div>
    `;
  }

  // Micro-interaction for navigation items
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('nav a').forEach(l => l.classList.remove('text-primary', 'font-semibold'));
      e.target.classList.add('text-primary', 'font-semibold');
    });
  });

  // Simple Intersection Observer for entrance animations
  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('elastic-entrance');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  setTimeout(() => {
    document.querySelectorAll('section > div').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }, 100);
});
