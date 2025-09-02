import { OklchColor } from './OklchColor';

export const COLOR_SCHEME_KEYS = [
    'primary',
    'onPrimary',
    'primaryContainer',
    'onPrimaryContainer',
    'secondary',
    'onSecondary',
    'secondaryContainer',
    'onSecondaryContainer',
    'surface',
    'onSurface',
    'onSurfaceVariant',
    'outline',
    'outlineVariant',
    'shadow',
] as const;

export type ColorSchemeKeys = (typeof COLOR_SCHEME_KEYS)[number];

export type ColorScheme = {
    [key in ColorSchemeKeys]: OklchColor;
};

const lightScheme: ColorScheme = {
    primary: OklchColor.fromHex('#456731'),
    onPrimary: OklchColor.fromHex('#ffffff'),
    primaryContainer: OklchColor.fromHex('#c6efaa'),
    onPrimaryContainer: OklchColor.fromHex('#2e4f1c'),
    secondary: OklchColor.fromHex('#5f5791'),
    onSecondary: OklchColor.fromHex('#ffffff'),
    secondaryContainer: OklchColor.fromHex('#e5deff'),
    onSecondaryContainer: OklchColor.fromHex('#473f77'),
    surface: OklchColor.fromHex('#f8faf0'),
    onSurface: OklchColor.fromHex('#191d16'),
    onSurfaceVariant: OklchColor.fromHex('#43483e'),
    outline: OklchColor.fromHex('#74796d'),
    outlineVariant: OklchColor.fromHex('#c3c8bb'),
    shadow: OklchColor.fromHex('#000000'),
};

const darkScheme: ColorScheme = {
    primary: OklchColor.fromHex('#aad290'),
    onPrimary: OklchColor.fromHex('#183806'),
    primaryContainer: OklchColor.fromHex('#2e4f1c'),
    onPrimaryContainer: OklchColor.fromHex('#c6efaa'),
    secondary: OklchColor.fromHex('#c9bfff'),
    onSecondary: OklchColor.fromHex('#30285f'),
    secondaryContainer: OklchColor.fromHex('#473f77'),
    onSecondaryContainer: OklchColor.fromHex('#e5deff'),
    surface: OklchColor.fromHex('#11140e'),
    onSurface: OklchColor.fromHex('#e1e4d9'),
    onSurfaceVariant: OklchColor.fromHex('#c3c8bb'),
    outline: OklchColor.fromHex('#8d9286'),
    outlineVariant: OklchColor.fromHex('#43483e'),
    shadow: OklchColor.fromHex('#000000'),
};

export const theme = {
    colors: {
        light: lightScheme,
        dark: darkScheme,
    },
} as const;
