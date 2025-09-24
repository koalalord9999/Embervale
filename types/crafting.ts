// A new type to define the context for the unified crafting modal.
// This tells the CraftingView what UI and recipes to display.
export type CraftingContext =
  | { type: 'anvil' }
  | { type: 'furnace' }
  | { type: 'cooking_range' }
  | { type: 'spinning_wheel' }
  | { type: 'leatherworking' } // From using needle on leather
  | { type: 'gem_cutting' }    // From using chisel on gem
  | { type: 'jewelry' }        // From using a furnace to craft jewelry
  | { type: 'fletching'; logId: string } // From using knife on logs
  | { type: 'dough_making' }
  | { type: 'bookbinding' }; // From using the new workbench