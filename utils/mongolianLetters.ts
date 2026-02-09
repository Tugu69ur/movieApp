/**
 * Mongolian Letter Mapping System
 * Maps Mongolian script characters to their Latin equivalents and positional forms
 */

export type LetterPosition = 'initial' | 'medial' | 'final';

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

/**
 * Comprehensive Mongolian letter mapping
 * Based on the reference charts in assets/alphabet/
 */
export const MONGOLIAN_LETTERS: Record<string, MongolianLetter> = {
    // Vowels
    'ᠠ': { char: 'ᠠ', latin: 'a', cyrillic: 'А' },
    'ᠡ': { char: 'ᠡ', latin: 'e', cyrillic: 'Э' },
    'ᠢ': { char: 'ᠢ', latin: 'i', cyrillic: 'И' },
    'ᠣ': { char: 'ᠣ', latin: 'o', cyrillic: 'О' },
    'ᠤ': { char: 'ᠤ', latin: 'u', cyrillic: 'У' },
    'ᠥ': { char: 'ᠥ', latin: 'ö', cyrillic: 'Ө' },
    'ᠦ': { char: 'ᠦ', latin: 'ü', cyrillic: 'Ү' },
    'ᠧ': { char: 'ᠧ', latin: 'ee', cyrillic: 'Е' },

    // Consonants
    'ᠨ': { char: 'ᠨ', latin: 'n', cyrillic: 'Н' },
    'ᠩ': { char: 'ᠩ', latin: 'ng', cyrillic: 'Нг' },
    'ᠪ': { char: 'ᠪ', latin: 'b', cyrillic: 'Б' },
    'ᠫ': { char: 'ᠫ', latin: 'p', cyrillic: 'П' },
    'ᠬ': { char: 'ᠬ', latin: 'h', cyrillic: 'Х' },
    'ᠭ': { char: 'ᠭ', latin: 'g', cyrillic: 'Г' },
    'ᠮ': { char: 'ᠮ', latin: 'm', cyrillic: 'М' },
    'ᠯ': { char: 'ᠯ', latin: 'l', cyrillic: 'Л' },
    'ᠰ': { char: 'ᠰ', latin: 's', cyrillic: 'С' },
    'ᠱ': { char: 'ᠱ', latin: 'sh', cyrillic: 'Ш' },
    'ᠲ': { char: 'ᠲ', latin: 't', cyrillic: 'Т' },
    'ᠳ': { char: 'ᠳ', latin: 'd', cyrillic: 'Д' },
    'ᠴ': { char: 'ᠴ', latin: 'ch', cyrillic: 'Ч' },
    'ᠵ': { char: 'ᠵ', latin: 'j', cyrillic: 'Ж' },
    'ᠶ': { char: 'ᠶ', latin: 'y', cyrillic: 'Й' },
    'ᠷ': { char: 'ᠷ', latin: 'r', cyrillic: 'Р' },
    'ᠸ': { char: 'ᠸ', latin: 'w', cyrillic: 'В' },
    'ᠹ': { char: 'ᠹ', latin: 'f', cyrillic: 'Ф' },
    'ᠺ': { char: 'ᠺ', latin: 'k', cyrillic: 'К' },
    'ᠻ': { char: 'ᠻ', latin: 'kh', cyrillic: 'Х' },
    'ᠼ': { char: 'ᠼ', latin: 'ts', cyrillic: 'Ц' },
    'ᠽ': { char: 'ᠽ', latin: 'z', cyrillic: 'З' },
    'ᠾ': { char: 'ᠾ', latin: 'h', cyrillic: 'Х' },
    'ᠿ': { char: 'ᠿ', latin: 'zh', cyrillic: 'Ж' },
    'ᡀ': { char: 'ᡀ', latin: 'ch', cyrillic: 'Ч' },
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
            position = 'initial';
        } else if (index === chars.length - 1) {
            position = 'final';
        } else {
            position = 'medial';
        }

        return {
            char,
            position,
            latin: letterData?.latin || '?',
            cyrillic: letterData?.cyrillic || '?',
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
export function getLetterImage(char: string, position: LetterPosition): any | null {
    const letter = MONGOLIAN_LETTERS[char];
    if (!letter) return null;

    // In the future, this could map to actual require statements if we have the assets:
    // return letter.images?.[position] || null;

    // For now, we return null to force text rendering
    return null;
}

/**
 * Example words for testing
 */
export const SAMPLE_WORDS = {
    'ᠬᠠᠪᠤᠷ': 'habur', // spring
    'ᠮᠣᠩᠭᠣᠯ': 'mongol', // Mongolia
    'ᠰᠠᠶᠢᠨ': 'sain', // good
    'ᠪᠠᠶᠠᠷ': 'bayar', // joy
};
