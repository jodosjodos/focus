import { Text, type StyleProp, type TextStyle } from 'react-native';
import { parseRichText } from '../utils/richText';
import { colors } from '../theme/colors';

export default function RichText({
  text,
  style,
  numberOfLines,
}: {
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const segments = parseRichText(text);
  return (
    <Text style={style} numberOfLines={numberOfLines}>
      {segments.map((seg, i) => (
        <Text
          key={i}
          style={[
            seg.bold && { fontWeight: '700' as const },
            seg.highlight && {
              backgroundColor: `${colors.primary}33`,
              color: colors.text,
            },
          ]}
        >
          {seg.text}
        </Text>
      ))}
    </Text>
  );
}
