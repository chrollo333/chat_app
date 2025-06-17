import { ChromePicker } from 'react-color';
import { useState } from 'react';

function ColorPicker({ onChange }: { onChange: (color: string) => void }) {
  const [color, setColor] = useState('#3498db');

  return (
    <ChromePicker
      color={color}
      onChangeComplete={(newColor) => {
        setColor(newColor.hex);
        onChange(newColor.hex);
      }}
    />
  );
}