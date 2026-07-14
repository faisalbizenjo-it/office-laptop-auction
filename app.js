(() => {
  "use strict";

  const config = window.AUCTION_CONFIG || {};
  const state = {
    records: [],
    filtered: [],
    selected: null
  };

  const $ = (selector) => document.querySelector(selector);

  const elements = {
    organizationName: $("#organizationName"),
    footerOrganization: $("#footerOrganization"),
    heroEyebrow: $("#heroEyebrow"),
    heroTitle: $("#heroTitle"),
    heroText: $("#heroText"),
    heroListingCount: $("#heroListingCount"),
    heroBrandCount: $("#heroBrandCount"),
    heroPriceFrom: $("#heroPriceFrom"),
    resultSummary: $("#resultSummary"),
    searchInput: $("#searchInput"),
    brandFilter: $("#brandFilter"),
    conditionFilter: $("#conditionFilter"),
    sortSelect: $("#sortSelect"),
    clearFilters: $("#clearFilters"),
    loadingState: $("#loadingState"),
    errorState: $("#errorState"),
    errorMessage: $("#errorMessage"),
    emptyState: $("#emptyState"),
    listingGrid: $("#listingGrid"),
    cardTemplate: $("#cardTemplate"),
    dialog: $("#detailsDialog"),
    closeDialog: $("#closeDialog"),
    dialogMedia: $("#dialogMedia"),
    dialogLot: $("#dialogLot"),
    dialogTitle: $("#dialogTitle"),
    dialogCondition: $("#dialogCondition"),
    dialogDescription: $("#dialogDescription"),
    dialogPrice: $("#dialogPrice"),
    dialogSpecs: $("#dialogSpecs"),
    dialogNotes: $("#dialogNotes"),
    bidButton: $("#bidButton"),
    copyLotButton: $("#copyLotButton"),
    bidHelp: $("#bidHelp")
  };

  function applyConfig() {
    document.title = config.pageTitle || "Office Laptop Auction";
    const organization = config.organizationName || "In-House Laptop Auction";
    elements.organizationName.textContent = organization;
    elements.footerOrganization.textContent = organization;
    elements.heroEyebrow.textContent = config.heroEyebrow || "Company equipment sale";
    elements.heroTitle.textContent =
      config.heroTitle || "Reliable office laptops, ready for a new home.";
    elements.heroText.textContent =
      config.heroText ||
      "Browse retired in-house laptops, compare specifications and review each lot before placing a bid.";
  }

  function parseCSV(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (char === '"' && inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        row.push(field);
        field = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && next === "\n") index += 1;
        row.push(field);
        if (row.some((value) => value.trim() !== "")) rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }

    if (field.length || row.length) {
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map((header) =>
      header.replace(/^\uFEFF/, "").trim()
    );

    return rows.slice(1).map((values) => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = (values[index] || "").trim();
      });
      return record;
    });
  }

  function normalized(value) {
    return String(value || "").trim();
  }

  function parseMoney(value) {
    const amount = Number(String(value || "").replace(/[^0-9.-]/g, ""));
    return Number.isFinite(amount) ? amount : 0;
  }

  function formatMoney(value, currency) {
    const amount = parseMoney(value);
    const code = normalized(currency) || config.defaultCurrency || "PKR";
    if (!amount) return "Contact for price";

    try {
      return new Intl.NumberFormat(config.currencyLocale || "en-PK", {
        style: "currency",
        currency: code,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2
      }).format(amount);
    } catch (error) {
      return `${code} ${amount.toLocaleString()}`;
    }
  }

  function isPublished(record) {
    const flag = normalized(record.publish_on_website).toLowerCase();
    return flag === "" || flag === "yes" || flag === "true" || flag === "1";
  }

  function imagePath(value) {
    const image = normalized(value);
    if (!image) return "";
    if (/^https?:\/\//i.test(image) || image.startsWith("data:")) return image;
    return `${config.imagesFolder || "images/"}${image}`;
  }

  function getTitle(record) {
    return (
      normalized(record.listing_title) ||
      [record.brand, record.model].map(normalized).filter(Boolean).join(" ") ||
      `Laptop ${record.lot_number || ""}`
    );
  }

  function getSubtitle(record) {
    return [record.brand, record.model, record.cpu]
      .map(normalized)
      .filter(Boolean)
      .filter((item, index, array) => array.indexOf(item) === index)
      .join(" · ");
  }

  function setSelectOptions(select, records, key) {
    const values = [...new Set(records.map((record) => normalized(record[key])).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function renderStats() {
    const brands = new Set(
      state.records.map((record) => normalized(record.brand).toLowerCase()).filter(Boolean)
    );
    const prices = state.records
      .map((record) => parseMoney(record.starting_bid))
      .filter((price) => price > 0);
    const minimumRecord = state.records
      .filter((record) => parseMoney(record.starting_bid) > 0)
      .sort((a, b) => parseMoney(a.starting_bid) - parseMoney(b.starting_bid))[0];

    elements.heroListingCount.textContent = state.records.length.toLocaleString();
    elements.heroBrandCount.textContent = brands.size.toLocaleString();
    elements.heroPriceFrom.textContent = prices.length
      ? formatMoney(minimumRecord.starting_bid, minimumRecord.currency_code)
      : "TBA";
  }

  function createChip(text) {
    const chip = document.createElement("span");
    chip.className = "spec-chip";
    chip.textContent = text;
    return chip;
  }

  function addImage(img, placeholder, record) {
    const src = imagePath(record.photo_1);
    if (!src) return;

    img.src = src;
    img.alt = `${getTitle(record)} auction photo`;
    img.hidden = false;
    placeholder.hidden = true;

    img.addEventListener(
      "error",
      () => {
        img.hidden = true;
        placeholder.hidden = false;
      },
      { once: true }
    );
  }

  function renderCards() {
    elements.listingGrid.replaceChildren();
    elements.emptyState.hidden = state.filtered.length > 0;
    elements.resultSummary.textContent = `${state.filtered.length} of ${state.records.length} lots shown`;

    state.filtered.forEach((record) => {
      const fragment = elements.cardTemplate.content.cloneNode(true);
      const card = fragment.querySelector(".listing-card");
      const placeholder = fragment.querySelector(".card-placeholder");
      const image = fragment.querySelector(".card-image");

      fragment.querySelector(".card-status").textContent =
        normalized(record.listing_status) || "Available";
      fragment.querySelector(".card-lot").textContent =
        `Lot ${normalized(record.lot_number) || "—"}`;
      fragment.querySelector(".card-condition").textContent =
        normalized(record.condition_grade) || "Condition TBA";
      fragment.querySelector(".card-title").textContent = getTitle(record);
      fragment.querySelector(".card-subtitle").textContent =
        getSubtitle(record) || "Specifications available in details";

      const chips = fragment.querySelector(".spec-chips");
      [
        normalized(record.ram_gb) ? `${record.ram_gb} RAM` : "",
        [record.storage_gb, record.storage_type].map(normalized).filter(Boolean).join(" "),
        normalized(record.screen_size_in) ? `${record.screen_size_in}" display` : "",
        normalized(record.charger_included)
      ]
        .filter(Boolean)
        .slice(0, 4)
        .forEach((text) => chips.appendChild(createChip(text)));

      fragment.querySelector(".card-price strong").textContent = formatMoney(
        record.starting_bid,
        record.currency_code
      );

      fragment.querySelector(".view-button").addEventListener("click", () => openDetails(record));
      fragment.querySelector(".card-bid-button").addEventListener("click", () => openBidForm(record));
      card.addEventListener("dblclick", () => openDetails(record));
      addImage(image, placeholder, record);
      elements.listingGrid.appendChild(fragment);
    });
  }

  function applyFilters() {
    const query = normalized(elements.searchInput.value).toLowerCase();
    const brand = normalized(elements.brandFilter.value).toLowerCase();
    const condition = normalized(elements.conditionFilter.value).toLowerCase();

    state.filtered = state.records.filter((record) => {
      const searchable = [
        record.lot_number,
        record.listing_title,
        record.brand,
        record.model,
        record.cpu,
        record.ram_gb,
        record.storage_type,
        record.storage_gb,
        record.gpu,
        record.condition_grade,
        record.functional_status
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (!brand || normalized(record.brand).toLowerCase() === brand) &&
        (!condition || normalized(record.condition_grade).toLowerCase() === condition)
      );
    });

    const sort = elements.sortSelect.value;
    state.filtered.sort((a, b) => {
      if (sort === "price-asc") {
        return parseMoney(a.starting_bid) - parseMoney(b.starting_bid);
      }
      if (sort === "price-desc") {
        return parseMoney(b.starting_bid) - parseMoney(a.starting_bid);
      }
      if (sort === "brand") {
        return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, undefined, {
          sensitivity: "base"
        });
      }
      if (sort === "lot") {
        return normalized(a.lot_number).localeCompare(normalized(b.lot_number), undefined, {
          numeric: true
        });
      }
      return 0;
    });

    renderCards();
  }

  function detailRow(label, value) {
    const cleanValue = normalized(value);
    if (!cleanValue) return null;

    const wrapper = document.createElement("div");
    wrapper.className = "spec-row";
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = cleanValue;
    wrapper.append(term, description);
    return wrapper;
  }

  function openDetails(record) {
    state.selected = record;
    elements.dialogLot.textContent = `Lot ${normalized(record.lot_number) || "—"}`;
    elements.dialogTitle.textContent = getTitle(record);
    elements.dialogCondition.textContent =
      normalized(record.condition_grade) || "Condition TBA";
    elements.dialogDescription.textContent =
      normalized(record.short_description) ||
      normalized(record.cosmetic_condition) ||
      "Review the recorded specifications and condition information below.";

    elements.dialogPrice.replaceChildren();
    const priceLabel = document.createElement("span");
    priceLabel.textContent = "Starting bid";
    const priceValue = document.createElement("strong");
    priceValue.textContent = formatMoney(record.starting_bid, record.currency_code);
    elements.dialogPrice.append(priceLabel, priceValue);

    elements.dialogSpecs.replaceChildren();
    const specs = [
      ["Brand", record.brand],
      ["Model", record.model],
      ["Processor", record.cpu],
      ["Memory", record.ram_gb],
      ["Storage", [record.storage_gb, record.storage_type].map(normalized).filter(Boolean).join(" ")],
      ["Graphics", record.gpu],
      ["Screen size", normalized(record.screen_size_in) ? `${record.screen_size_in} inches` : ""],
      ["Condition", record.condition_grade],
      ["Functional status", record.functional_status],
      ["Charger", record.charger_included],
      ["Keyboard", record.keyboard_layout],
      ["Ports & connectivity", record.ports_connectivity],
      ["Warranty", record.warranty_status],
      ["Bid increment", record.bid_increment ? formatMoney(record.bid_increment, record.currency_code) : ""],
      ["Auction starts", record.auction_start],
      ["Auction ends", record.auction_end]
    ];

    specs.forEach(([label, value]) => {
      const row = detailRow(label, value);
      if (row) elements.dialogSpecs.appendChild(row);
    });

    const notes = [record.known_issues, record.public_notes]
      .map(normalized)
      .filter(Boolean)
      .join(" ");
    elements.dialogNotes.hidden = !notes;
    elements.dialogNotes.textContent = notes;

    elements.dialogMedia.replaceChildren();
    const src = imagePath(record.photo_1);
    if (src) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${getTitle(record)} auction photo`;
      img.addEventListener("error", renderDialogPlaceholder, { once: true });
      elements.dialogMedia.appendChild(img);
    } else {
      renderDialogPlaceholder();
    }

    const hasBidUrl = normalized(config.bidFormUrl);
    const hasEmail = normalized(config.supportEmail);
    elements.bidButton.disabled = false;
    elements.bidButton.textContent = hasBidUrl
      ? "Open bid form"
      : hasEmail
        ? "Send bid enquiry"
        : "Bid on this laptop";
    elements.bidHelp.textContent =
      hasBidUrl || hasEmail
        ? "The selected lot number and laptop title will be included automatically."
        : "Add the Google Form pre-filled link to bidFormUrl in config.js.";

    if (typeof elements.dialog.showModal === "function") {
      elements.dialog.showModal();
    } else {
      elements.dialog.setAttribute("open", "");
    }
  }

  function renderDialogPlaceholder() {
    elements.dialogMedia.replaceChildren();
    elements.dialogMedia.innerHTML = `
      <svg viewBox="0 0 180 180" aria-hidden="true">
        <rect x="35" y="42" width="110" height="76" rx="8"></rect>
        <path d="M20 135h140"></path>
        <path d="M73 135h34"></path>
      </svg>
    `;
  }

  function openBidForm(record) {
    if (!record) return;

    const lot = encodeURIComponent(normalized(record.lot_number));
    const title = encodeURIComponent(getTitle(record));

    if (normalized(config.bidFormUrl)) {
      const destination = config.bidFormUrl
        .replaceAll("{lot_number}", lot)
        .replaceAll("{listing_title}", title);
      window.open(destination, "_blank", "noopener,noreferrer");
      return;
    }

    if (normalized(config.supportEmail)) {
      const subject = encodeURIComponent(`Bid enquiry for lot ${record.lot_number}`);
      const body = encodeURIComponent(
        `Hello,\n\nI would like to submit a bid for:\nLot: ${record.lot_number}\nLaptop: ${getTitle(record)}\n\nMy bid amount:\nEmployee name:\nEmployee ID:\nContact number:\n\nThank you.`
      );
      window.location.href = `mailto:${config.supportEmail}?subject=${subject}&body=${body}`;
      return;
    }

    window.alert(
      "The Google Form bidding link has not been configured yet. Add the pre-filled form link to bidFormUrl in config.js."
    );
  }

  function handleBid() {
    openBidForm(state.selected);
  }

  async function copyLotNumber() {
    if (!state.selected) return;
    const value = normalized(state.selected.lot_number);
    try {
      await navigator.clipboard.writeText(value);
      elements.bidHelp.textContent = `Copied ${value} to the clipboard.`;
    } catch (error) {
      elements.bidHelp.textContent = `Lot number: ${value}`;
    }
  }

  function closeDialog() {
    if (typeof elements.dialog.close === "function") {
      elements.dialog.close();
    } else {
      elements.dialog.removeAttribute("open");
    }
  }

  function bindEvents() {
    elements.searchInput.addEventListener("input", applyFilters);
    elements.brandFilter.addEventListener("change", applyFilters);
    elements.conditionFilter.addEventListener("change", applyFilters);
    elements.sortSelect.addEventListener("change", applyFilters);

    elements.clearFilters.addEventListener("click", () => {
      elements.searchInput.value = "";
      elements.brandFilter.value = "";
      elements.conditionFilter.value = "";
      elements.sortSelect.value = "default";
      applyFilters();
      elements.searchInput.focus();
    });

    elements.closeDialog.addEventListener("click", closeDialog);
    elements.dialog.addEventListener("click", (event) => {
      if (event.target === elements.dialog) closeDialog();
    });
    elements.dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog();
    });
    elements.bidButton.addEventListener("click", handleBid);
    elements.copyLotButton.addEventListener("click", copyLotNumber);
  }

  async function loadData() {
    try {
      const response = await fetch(config.dataFile || "data/laptops.csv", {
        cache: "no-store"
      });
      if (!response.ok) {
        throw new Error(`The inventory file returned HTTP ${response.status}.`);
      }

      const text = await response.text();
      const records = parseCSV(text).filter(
        (record) => normalized(record.lot_number) && isPublished(record)
      );

      state.records = records;
      state.filtered = [...records];

      setSelectOptions(elements.brandFilter, records, "brand");
      setSelectOptions(elements.conditionFilter, records, "condition_grade");
      renderStats();
      renderCards();

      elements.loadingState.hidden = true;
      if (records.length === 0) {
        elements.emptyState.hidden = false;
        elements.resultSummary.textContent = "No published lots";
      }
    } catch (error) {
      console.error(error);
      elements.loadingState.hidden = true;
      elements.errorState.hidden = false;
      elements.errorMessage.textContent =
        "Check that data/laptops.csv exists and that the website is opened through Vercel or a local web server.";
      elements.resultSummary.textContent = "Catalogue unavailable";
    }
  }

  applyConfig();
  bindEvents();
  loadData();
})();
