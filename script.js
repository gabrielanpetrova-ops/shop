const catalog = [
  { id: 'sky-tee', name: 'Sky Tee', category: 'tops', price: 28, style: 'casual', color: 'blue' },
  { id: 'rose-cardigan', name: 'Rose Cardigan', category: 'tops', price: 42, style: 'chic', color: 'pink' },
  { id: 'midnight-blazer', name: 'Midnight Blazer', category: 'tops', price: 65, style: 'elegant', color: 'black' },
  { id: 'sunset-shirt', name: 'Sunset Shirt', category: 'tops', price: 33, style: 'vibrant', color: 'red' },
  { id: 'copper-jeans', name: 'Copper Jeans', category: 'bottoms', price: 48, style: 'casual', color: 'orange' },
  { id: 'ivory-satin', name: 'Ivory Satin', category: 'bottoms', price: 55, style: 'elegant', color: 'cream' },
  { id: 'moss-skirt', name: 'Moss Skirt', category: 'bottoms', price: 40, style: 'eclectic', color: 'green' },
  { id: 'luna-dress', name: 'Luna Dress', category: 'dresses', price: 72, style: 'chic', color: 'pink' },
  { id: 'sable-gown', name: 'Sable Gown', category: 'dresses', price: 88, style: 'elegant', color: 'black' },
  { id: 'pebble-dress', name: 'Pebble Dress', category: 'dresses', price: 58, style: 'casual', color: 'neutral' },
  { id: 'stone-loafers', name: 'Stone Loafers', category: 'shoes', price: 36, style: 'casual', color: 'neutral' },
  { id: 'rose-heels', name: 'Rose Heels', category: 'shoes', price: 52, style: 'chic', color: 'pink' },
  { id: 'midnight-kicks', name: 'Midnight Kicks', category: 'shoes', price: 49, style: 'elegant', color: 'black' },
  { id: 'gold-bangle', name: 'Gold Bangle', category: 'accessories', price: 18, style: 'chic', color: 'gold' },
  { id: 'leaf-bag', name: 'Leaf Bag', category: 'accessories', price: 24, style: 'eclectic', color: 'green' },
  { id: 'storm-scarf', name: 'Storm Scarf', category: 'accessories', price: 22, style: 'casual', color: 'blue' }
];

const styleNames = {
  casual: 'Casual',
  chic: 'Chic',
  elegant: 'Elegant',
  vibrant: 'Bold',
  eclectic: 'Eclectic'
};

const customerNames = ['Mila', 'Noah', 'Jade', 'Theo', 'Ava', 'Leo', 'Nina', 'Ezra', 'Rosa', 'Kai'];
const customerDescriptors = [
  'needs a look for a coffee date',
  'wants an outfit for a gallery opening',
  'is styling for a weekend market stroll',
  'needs an easy fit for a rooftop party',
  'wants a polished look for brunch',
  'wants something bold for a concert night'
];

const state = {
  day: 1,
  money: 160,
  reputation: 0,
  selected: {},
  customer: null,
  log: ['The boutique doors open for the first day.']
};

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function createCustomer() {
  const style = randomFrom(Object.keys(styleNames));
  const color = randomFrom(['blue', 'pink', 'black', 'neutral', 'green', 'red', 'gold']);
  const category = randomFrom(['tops', 'bottoms', 'dresses', 'shoes', 'accessories']);
  const budget = 60 + Math.floor(Math.random() * 110) + state.day * 6;

  state.customer = {
    name: randomFrom(customerNames),
    style,
    color,
    category,
    budget,
    vibe: randomFrom(customerDescriptors),
    wantedItem: randomFrom(catalog)
  };
}

function getOutfitTotal() {
  return Object.values(state.selected).reduce((sum, item) => sum + item.price, 0);
}

function evaluateOutfit() {
  const selectedItems = Object.values(state.selected);
  if (!selectedItems.length) {
    return { valid: false, score: 0, total: 0, reason: 'Choose at least one piece before presenting the outfit.' };
  }

  const categories = selectedItems.map((item) => item.category);
  const hasDress = categories.includes('dresses');
  const hasTop = categories.includes('tops');
  const hasBottom = categories.includes('bottoms');
  const hasShoes = categories.includes('shoes');
  const hasAccessory = categories.includes('accessories');

  const outfitComplete = hasDress || (hasTop && hasBottom) || (hasTop && hasShoes) || (hasBottom && hasShoes);

  if (!outfitComplete) {
    return { valid: false, score: 0, total: getOutfitTotal(), reason: 'The outfit still feels incomplete.' };
  }

  let score = 0;
  const total = getOutfitTotal();
  const customer = state.customer;

  selectedItems.forEach((item) => {
    if (item.style === customer.style) score += 3;
    if (item.color === customer.color) score += 2;
    if (item.category === customer.category) score += 2;
    if (item.category === 'accessories' && hasAccessory) score += 1;
  });

  if (total <= customer.budget) score += 4;
  else score -= 5;

  if (selectedItems.length >= 3) score += 2;

  const valid = score >= 12;
  const reason = valid
    ? `Strong match! ${customer.name} loves the look and the price works.`
    : total > customer.budget
      ? `The outfit is close, but it runs over budget for ${customer.name}.`
      : `This style misses the mark for ${customer.name}'s taste.`;

  return { valid, score, total, reason };
}

function addLog(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 6);
}

function renderInventory() {
  const inventoryGrid = document.getElementById('inventoryGrid');
  inventoryGrid.innerHTML = '';

  catalog.forEach((item) => {
    const card = document.createElement('article');
    card.className = `item-card ${state.selected[item.category]?.id === item.id ? 'selected' : ''}`;

    const swatch = document.createElement('div');
    swatch.className = 'item-swatch';
    swatch.style.background = getColor(item.color);

    const title = document.createElement('h3');
    title.textContent = item.name;

    const meta = document.createElement('div');
    meta.className = 'item-meta';
    meta.innerHTML = `<span>${styleNames[item.style]}</span><strong>$${item.price}</strong>`;

    const button = document.createElement('button');
    button.textContent = state.selected[item.category]?.id === item.id ? 'Added' : 'Add to outfit';
    button.classList.toggle('added', state.selected[item.category]?.id === item.id);

    button.addEventListener('click', () => {
      const currentSelection = state.selected[item.category];
      if (currentSelection && currentSelection.id === item.id) {
        delete state.selected[item.category];
      } else {
        state.selected[item.category] = item;
      }
      render();
    });

    card.appendChild(swatch);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(button);
    inventoryGrid.appendChild(card);
  });
}

function getColor(color) {
  const palette = {
    blue: 'linear-gradient(135deg, #7ebbec, #3d6dcc)',
    pink: 'linear-gradient(135deg, #f8b8c9, #d06ca7)',
    black: 'linear-gradient(135deg, #3d3d3d, #0f1013)',
    neutral: 'linear-gradient(135deg, #d5c9bc, #b7a390)',
    green: 'linear-gradient(135deg, #97d4a5, #3a8a59)',
    red: 'linear-gradient(135deg, #f0a07c, #d85a52)',
    gold: 'linear-gradient(135deg, #f7d57d, #d8a338)',
    orange: 'linear-gradient(135deg, #f6b679, #d5783c)',
    cream: 'linear-gradient(135deg, #f5f0e3, #d8d0b3)'
  };
  return palette[color] || 'linear-gradient(135deg, #d9d9d9, #b6b6b6)';
}

function renderCustomerPanel() {
  const customer = state.customer;
  const avatarElement = document.getElementById('customerAvatar');
  const nameElement = document.getElementById('customerName');
  const profileElement = document.getElementById('customerProfile');
  const requestElement = document.getElementById('customerRequest');

  avatarElement.textContent = customer.name.charAt(0);
  nameElement.textContent = customer.name;
  profileElement.textContent = `${styleNames[customer.style]} vibes • wants ${customer.color} accents • budget $${customer.budget}`;

  requestElement.innerHTML = `
    <strong>Style brief</strong>
    ${customer.name} is looking for a ${styleNames[customer.style].toLowerCase()} outfit with ${customer.color} tones.
    They want something suited for ${customer.vibe} and can spend up to $${customer.budget}.<br />
    Best fit: ${customer.category === 'dresses' ? 'a dress or coordinated set' : `a ${customer.category} statement piece plus supporting layers`}.<br />
    Keep the total under budget and match the tone.
  `;
}

function renderOutfitPreview() {
  const preview = document.getElementById('outfitPreview');
  preview.innerHTML = '';

  const categories = ['tops', 'bottoms', 'dresses', 'shoes', 'accessories'];

  categories.forEach((category) => {
    const item = state.selected[category];
    const slot = document.createElement('div');
    slot.className = 'outfit-slot';

    const slotName = document.createElement('span');
    slotName.className = 'slot-name';
    slotName.textContent = category;

    const slotValue = document.createElement('span');
    slotValue.className = 'slot-value';
    slotValue.textContent = item ? item.name : '—';

    slot.appendChild(slotName);
    slot.appendChild(slotValue);
    preview.appendChild(slot);
  });
}

function renderStats() {
  document.getElementById('dayDisplay').textContent = state.day;
  document.getElementById('moneyDisplay').textContent = `$${state.money}`;
  document.getElementById('repDisplay').textContent = state.reputation;
}

function renderLog() {
  const log = document.getElementById('shopLog');
  log.innerHTML = '';

  state.log.forEach((entry) => {
    const item = document.createElement('li');
    item.textContent = entry;
    log.appendChild(item);
  });
}

function updateStatus(message) {
  document.getElementById('statusMessage').textContent = message;
}

function render() {
  renderInventory();
  renderCustomerPanel();
  renderOutfitPreview();
  renderStats();
  renderLog();
}

function nextDay() {
  state.day += 1;
  state.selected = {};
  createCustomer();
  updateStatus(`A new guest arrives. Day ${state.day} starts with a fresh lookbook.`);
  render();
}

function handleCheckFit() {
  const result = evaluateOutfit();
  updateStatus(result.reason);
}

function handleSell() {
  const result = evaluateOutfit();

  if (!result.valid) {
    state.reputation = Math.max(0, state.reputation - 1);
    addLog(`${state.customer.name} says, “Not quite right.”`);
    updateStatus(`Not a sale yet. Adjust the outfit to better match ${state.customer.name}'s style and budget.`);
    render();
    return;
  }

  const saleValue = Math.max(30, result.total);
  state.money += saleValue;
  state.reputation += 1;
  addLog(`${state.customer.name} bought the look for $${saleValue}.`);
  updateStatus(`${state.customer.name} loved it. The boutique makes a sale and the shop feels brighter.`);
  nextDay();
}

function resetGame() {
  state.day = 1;
  state.money = 160;
  state.reputation = 0;
  state.selected = {};
  state.log = ['The boutique doors open for the first day.'];
  createCustomer();
  updateStatus('Fresh inventory is stocked and the first customer has arrived.');
  render();
}

document.getElementById('checkBtn').addEventListener('click', handleCheckFit);
document.getElementById('sellBtn').addEventListener('click', handleSell);
document.getElementById('nextDayBtn').addEventListener('click', () => {
  state.reputation = Math.max(0, state.reputation - 1);
  addLog(`${state.customer.name} leaves to keep shopping elsewhere.`);
  nextDay();
});
document.getElementById('resetBtn').addEventListener('click', resetGame);

createCustomer();
render();
updateStatus('Pick a few pieces and match the guest before you sell the look.');
