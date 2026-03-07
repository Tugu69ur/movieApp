/**
 * Mongolian Letter Mapping System
 * Maps Mongolian script characters to their Latin equivalents and positional forms
 */

export type LetterPosition = "initial" | "medial" | "final";

export interface MongolianLetter {
  char: string;
  latin: string;
  cyrillic: string;
  images?: {
    initial?: any;
    medial?: any;
    final?: any;
  };
}

export interface PositionedLetter {
  char: string;
  position: LetterPosition;
  latin: string;
  cyrillic: string;
  index: number;
}

const CELL_IMAGES: Record<string, Partial<Record<LetterPosition, any>>> = {
  a: {
    initial: require("../assets/cells/a/initial/a_initial_r00.png"),
    medial: require("../assets/cells/a/medial/a_medial_r00.png"),
    final: require("../assets/cells/a/final/a_final_r00.png"),
  },
  b: {
    initial: require("../assets/cells/b/initial/b_initial_r02.png"),
    medial: require("../assets/cells/b/medial/b_medial_r02.png"),
    final: require("../assets/cells/b/final/b_final_r02.png"),
  },
  ch: {
    initial: require("../assets/cells/ch/initial/ch_initial_r01.png"),
    medial: require("../assets/cells/ch/medial/ch_medial_r01.png"),
    final: require("../assets/cells/ch/final/ch_final_r01.png"),
  },
  d: {
    initial: require("../assets/cells/d/initial/d_initial_r00.png"),
    medial: require("../assets/cells/d/medial/d_medial_r00.png"),
    final: require("../assets/cells/d/final/d_final_r00.png"),
  },
  e: {
    initial: require("../assets/cells/e/initial/e_initial_r01.png"),
    medial: require("../assets/cells/e/medial/e_medial_r01.png"),
    final: require("../assets/cells/e/final/e_final_r01.png"),
  },
  g: {
    initial: require("../assets/cells/g/initial/g_initial_r00.png"),
    medial: require("../assets/cells/g/medial/g_medial_r00.png"),
    final: require("../assets/cells/g/final/g_final_r00.png"),
  },
  h: {
    initial: require("../assets/cells/h/initial/h_initial_r04.png"),
    medial: require("../assets/cells/h/medial/h_medial_r04.png"),
    final: require("../assets/cells/h/final/h_final_r04.png"),
  },
  i: {
    initial: require("../assets/cells/i/initial/i_initial_r02.png"),
    medial: require("../assets/cells/i/medial/i_medial_r02.png"),
    final: require("../assets/cells/i/final/i_final_r02.png"),
  },
  ii: {
    initial: require("../assets/cells/ii/initial/ii_initial_r03.png"),
    medial: require("../assets/cells/ii/medial/ii_medial_r03.png"),
    final: require("../assets/cells/ii/final/ii_final_r03.png"),
  },
  j: {
    initial: require("../assets/cells/j/initial/j_initial_r02.png"),
    medial: require("../assets/cells/j/medial/j_medial_r02.png"),
    final: require("../assets/cells/j/final/j_final_r02.png"),
  },
  l: {
    initial: require("../assets/cells/l/initial/l_initial_r02.png"),
    medial: require("../assets/cells/l/medial/l_medial_r02.png"),
    final: require("../assets/cells/l/final/l_final_r02.png"),
  },
  m: {
    initial: require("../assets/cells/m/initial/m_initial_r01.png"),
    medial: require("../assets/cells/m/medial/m_medial_r01.png"),
    final: require("../assets/cells/m/final/m_final_r01.png"),
  },
  n: {
    initial: require("../assets/cells/n/initial/n_initial_r00.png"),
    medial: require("../assets/cells/n/medial/n_medial_r00.png"),
    final: require("../assets/cells/n/final/n_final_r00.png"),
  },
  ng: {
    initial: require("../assets/cells/ng/initial/ng_initial_r01.png"),
    medial: require("../assets/cells/ng/medial/ng_medial_r01.png"),
    final: require("../assets/cells/ng/final/ng_final_r01.png"),
  },
  o: {
    initial: require("../assets/cells/o/initial/o_initial_r03.png"),
    medial: require("../assets/cells/o/medial/o_medial_r03.png"),
    final: require("../assets/cells/o/final/o_final_r03.png"),
  },
  ou: {
    initial: require("../assets/cells/ou/initial/ou_initial_r05.png"),
    medial: require("../assets/cells/ou/medial/ou_medial_r05.png"),
  },
  p: {
    initial: require("../assets/cells/p/initial/p_initial_r03.png"),
    medial: require("../assets/cells/p/medial/p_medial_r03.png"),
    final: require("../assets/cells/p/final/p_final_r03.png"),
  },
  r: {
    initial: require("../assets/cells/r/initial/r_initial_r04.png"),
    medial: require("../assets/cells/r/medial/r_medial_r04.png"),
    final: require("../assets/cells/r/final/r_final_r04.png"),
  },
  s: {
    initial: require("../assets/cells/s/initial/s_initial_r03.png"),
    medial: require("../assets/cells/s/medial/s_medial_r03.png"),
    final: require("../assets/cells/s/final/s_final_r03.png"),
  },
  sh: {
    initial: require("../assets/cells/sh/initial/sh_initial_r04.png"),
    medial: require("../assets/cells/sh/medial/sh_medial_r04.png"),
    final: require("../assets/cells/sh/final/sh_final_r04.png"),
  },
  t: {
    initial: require("../assets/cells/t/initial/t_initial_r05.png"),
    medial: require("../assets/cells/t/medial/t_medial_r05.png"),
    final: require("../assets/cells/t/final/t_final_r05.png"),
  },
  u: {
    initial: require("../assets/cells/u/initial/u_initial_r04.png"),
    medial: require("../assets/cells/u/medial/u_medial_r04.png"),
    final: require("../assets/cells/u/final/u_final_r04.png"),
  },
};

const LATIN_TO_CELL_KEY: Record<string, string> = {
  ee: "ii",
  ö: "ou",
  ü: "u",
  y: "i",
  w: "u",
  f: "p",
  k: "h",
  kh: "h",
  ts: "ch",
  z: "j",
  zh: "j",
};

/**
 * Comprehensive Mongolian letter mapping
 * Based on the reference charts in assets/alphabet/
 */
export const MONGOLIAN_LETTERS: Record<string, MongolianLetter> = {
  // Vowels
  ᠠ: { char: "ᠠ", latin: "a", cyrillic: "А" },
  ᠡ: { char: "ᠡ", latin: "e", cyrillic: "Э" },
  ᠢ: { char: "ᠢ", latin: "i", cyrillic: "И" },
  ᠣ: { char: "ᠣ", latin: "o", cyrillic: "О" },
  ᠤ: { char: "ᠤ", latin: "u", cyrillic: "У" },
  ᠥ: { char: "ᠥ", latin: "ö", cyrillic: "Ө" },
  ᠦ: { char: "ᠦ", latin: "ü", cyrillic: "Ү" },
  ᠧ: { char: "ᠧ", latin: "ee", cyrillic: "Е" },

  // Consonants
  ᠨ: { char: "ᠨ", latin: "n", cyrillic: "Н" },
  ᠩ: { char: "ᠩ", latin: "ng", cyrillic: "Нг" },
  ᠪ: { char: "ᠪ", latin: "b", cyrillic: "Б" },
  ᠫ: { char: "ᠫ", latin: "p", cyrillic: "П" },
  ᠬ: { char: "ᠬ", latin: "h", cyrillic: "Х" },
  ᠭ: { char: "ᠭ", latin: "g", cyrillic: "Г" },
  ᠮ: { char: "ᠮ", latin: "m", cyrillic: "М" },
  ᠯ: { char: "ᠯ", latin: "l", cyrillic: "Л" },
  ᠰ: { char: "ᠰ", latin: "s", cyrillic: "С" },
  ᠱ: { char: "ᠱ", latin: "sh", cyrillic: "Ш" },
  ᠲ: { char: "ᠲ", latin: "t", cyrillic: "Т" },
  ᠳ: { char: "ᠳ", latin: "d", cyrillic: "Д" },
  ᠴ: { char: "ᠴ", latin: "ch", cyrillic: "Ч" },
  ᠵ: { char: "ᠵ", latin: "j", cyrillic: "Ж" },
  ᠶ: { char: "ᠶ", latin: "y", cyrillic: "Й" },
  ᠷ: { char: "ᠷ", latin: "r", cyrillic: "Р" },
  ᠸ: { char: "ᠸ", latin: "w", cyrillic: "В" },
  ᠹ: { char: "ᠹ", latin: "f", cyrillic: "Ф" },
  ᠺ: { char: "ᠺ", latin: "k", cyrillic: "К" },
  ᠻ: { char: "ᠻ", latin: "kh", cyrillic: "Х" },
  ᠼ: { char: "ᠼ", latin: "ts", cyrillic: "Ц" },
  ᠽ: { char: "ᠽ", latin: "z", cyrillic: "З" },
  ᠾ: { char: "ᠾ", latin: "h", cyrillic: "Х" },
  ᠿ: { char: "ᠿ", latin: "zh", cyrillic: "Ж" },
  ᡀ: { char: "ᡀ", latin: "ch", cyrillic: "Ч" },
};

/**
 * Split a Mongolian word into individual letters with position information
 * @param word - Mongolian script word
 * @returns Array of positioned letters
 */
export function splitWord(word: string): PositionedLetter[] {
  const chars = Array.from(word);

  return chars.map((char, index) => {
    const letterData = MONGOLIAN_LETTERS[char];

    // Determine position
    let position: LetterPosition;
    if (index === 0) {
      position = "initial";
    } else if (index === chars.length - 1) {
      position = "final";
    } else {
      position = "medial";
    }

    return {
      char,
      position,
      latin: letterData?.latin || "?",
      cyrillic: letterData?.cyrillic || "?",
      index,
    };
  });
}

/**
 * Get letter image path based on character and position
 * @param char - Mongolian character
 * @param position - Letter position in word
 * @returns Image require path or null
 */
export function getLetterImage(
  char: string,
  position: LetterPosition,
): any | null {
  const letter = MONGOLIAN_LETTERS[char];
  if (!letter) return null;

  const normalizedLatin = LATIN_TO_CELL_KEY[letter.latin] || letter.latin;
  const cell = CELL_IMAGES[normalizedLatin];
  if (!cell) return null;

  return cell[position] || cell.medial || cell.initial || cell.final || null;
}

/**
 * Example words for testing
 */
export const SAMPLE_WORDS = {
  ᠬᠠᠪᠤᠷ: "habur", // spring
  ᠮᠣᠩᠭᠣᠯ: "mongol", // Mongolia
  ᠰᠠᠶᠢᠨ: "sain", // good
  ᠪᠠᠶᠠᠷ: "bayar", // joy
};
