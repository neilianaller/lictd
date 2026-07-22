import { StatsFetcher } from './stats-fetcher.js';

class AppDirectory {
  constructor() {
    this.apps = [];
    this.filteredApps = [];
    this.currentCategory = 'All';
    this.gridContainer = document.getElementById('apps-grid');
    this.categoryFilters = document.querySelectorAll('.category-filter');
    this.modal = document.getElementById('modal-overlay');
    this.closeModalBtn = document.getElementById('close-modal');
    this.modalBody = document.getElementById('modal-body');
    this.modalTitle = document.getElementById('modal-title');

    this.init();
  }

  async init() {
    await this.fetchApps();
    this.setupEventListeners();
    this.render();
  }

  async fetchApps() {
    try {
      const response = await fetch('/assets/data/apps.json');
      if (!response.ok) throw new Error('Failed to load directory data');
      this.apps = await response.json();
      this.filteredApps = [...this.apps];
    } catch (error) {
      console.error(error);
      this.gridContainer.innerHTML = '<p class="text-red-400">Failed to load applications.</p>';
    }
  }

  setupEventListeners() {
    this.categoryFilters.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.categoryFilters.forEach(b => {
          b.classList.remove('bg-cyan-500', 'text-slate-900');
          b.classList.add('glass-panel', 'text-white');
        });
        const target = e.target;
        target.classList.remove('glass-panel', 'text-white');
        target.classList.add('bg-cyan-500', 'text-slate-900');

        this.currentCategory = target.dataset.category;
        this.filterApps();
      });
    });

    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  filterApps() {
    this.filteredApps = this.apps.filter(app => {
      const matchesCategory = this.currentCategory === 'All' || app.category === this.currentCategory;
      return matchesCategory;
    });
    this.render();
  }

  render() {
    if (this.filteredApps.length === 0) {
      this.gridContainer.innerHTML = '<p class="col-span-full text-center text-slate-400 py-10">No systems found matching your criteria.</p>';
      return;
    }

    this.gridContainer.innerHTML = this.filteredApps.map(app => `
      <div class="tilt-card glass-panel rounded-xl p-6 relative flex flex-col h-full" data-id="${app.id}">
        <div class="flex justify-between items-start mb-4">
          <div class="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
            <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <!-- Placeholder icon based on the icon string, normally you'd map these to real SVGs -->
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="status-indicator ${app.status === 'online' ? '' : 'offline'}" title="${app.status}"></span>
        </div>
        <div class="mb-auto">
          <span class="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2 block">${app.category}</span>
          <h3 class="text-xl font-bold mb-2 text-white">${app.title}</h3>
          <p class="text-slate-400 text-sm mb-6">${app.tagline}</p>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-2">
          <button class="view-metrics-btn w-full py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white rounded-lg text-center text-sm font-medium transition-all shadow-lg shadow-cyan-500/20" data-endpoint="${app.statsEndpoint}" data-title="${app.title}">View Live Metrics</button>
        </div>
      </div>
    `).join('');

    this.setupTiltEffect();
    this.setupMetricButtons();
  }

  setupTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  setupMetricButtons() {
    const buttons = document.querySelectorAll('.view-metrics-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const endpoint = e.target.dataset.endpoint;
        const title = e.target.dataset.title;
        this.openModal(title, endpoint);
      });
    });
  }

  async openModal(title, endpoint) {
    this.modalTitle.textContent = `${title} - Live Metrics`;
    this.modalBody.innerHTML = '<div class="flex justify-center items-center py-12"><div class="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>';

    this.modal.classList.remove('hidden');
    // Small delay to allow display:block to apply before animating opacity
    setTimeout(() => {
      this.modal.classList.add('opacity-100', 'active');
      this.modal.classList.remove('opacity-0');
    }, 10);

    const stats = await StatsFetcher.fetchStats(endpoint);

    if (!stats) {
      this.modalBody.innerHTML = '<div class="text-center py-8 text-red-400"><p>Stats Temporarily Unavailable</p></div>';
      return;
    }

    this.modalBody.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        ${stats.metrics.map(metric => `
          <div class="glass-panel bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 text-center">
            <p class="text-sm text-slate-400 mb-2">${metric.label}</p>
            <p class="text-3xl font-bold gradient-text">${metric.type === 'currency' ? '₱' : ''}${this.formatNumber(metric.value)}</p>
          </div>
        `).join('')}
      </div>
      <div class="mt-6 text-xs text-center text-slate-500">
        Status: <span class="text-emerald-400 uppercase">${stats.status}</span> | Last updated: Just now
      </div>
    `;
  }

  formatNumber(val) {
    // Simple formatter, in a real app might use animation counters
    const num = parseFloat(val.toString().replace(/[^0-9.-]+/g, ""));
    if (isNaN(num)) return val;
    return num.toLocaleString();
  }

  closeModal() {
    this.modal.classList.remove('opacity-100', 'active');
    this.modal.classList.add('opacity-0');
    setTimeout(() => {
      this.modal.classList.add('hidden');
    }, 300); // match transition duration
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AppDirectory();
});
