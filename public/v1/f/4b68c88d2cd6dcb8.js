/* Edition metadata belongs to the game, not to the shared interpreter. */
(() => {
 const E=StoryEngine,story=E.story;
 const cases={
  'vale-dossiers-p1c1-v01':{part:'I',chapters:6,endings:4,source:'A Scandal in Bohemia',sourceUrl:'https://www.gutenberg.org/ebooks/1661'},
  'vale-dossiers-part2-v01':{part:'II',chapters:6,endings:4,source:'The Adventure of the Speckled Band',sourceUrl:'https://www.gutenberg.org/ebooks/1661'},
  'vale-dossiers-part3-v01':{part:'III',chapters:5,endings:4,source:'Silver Blaze',sourceUrl:'https://www.gutenberg.org/ebooks/834'}
 };
 E.story=b=>story({...b,defaultNarration:true,caseMeta:cases[b.id]||b.caseMeta});
})();
