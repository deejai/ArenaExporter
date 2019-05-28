
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    initializeDatabase()
  }
})

async function initializeDatabase () {
  const response = await fetch(chrome.extension.getURL('/data/reduced.json'))
  const setJSON = await response.json()
  console.log(setJSON)

  for (const set of setJSON.sets) {
    const cards = {}

    // Updated to fetch full names of split cards
    for (const card of set.cards) {
      let cardKey
      if(card.layout == "split" && card.names.length == 2) {
        cardKey = `${card.names[0]} // ${card.names[1]}`
      }
      else {
        cardKey = `${card.name}`
      }

      cards[cardKey] = {
        number: card.number,
        translations: card.translations,
        set: set.name,
        // added for split cards
        layout: card.layout,
        names: card.names
      }
    }
    chrome.storage.local.set(cards)
    console.log(cards)
  }
  chrome.storage.local.set({ language: 'English' })
}
