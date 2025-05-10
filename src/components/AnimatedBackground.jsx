import { useTheme } from '@mui/material/styles';
import '../styles/AnimatedBackground.css'; 

export default function AnimatedBackground() {
    const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const colors = isDark
    ? ['#972297', '#151948', '#222EA5', '#431051', '#2F1154', '#0E1438', '#212E9F', '#300D3F']
    : ['#A2A8FF', '#76B9FE', '#79C3FF', '#95C6FF', '#78DFFD', '#9ACEFF', '#5BF9FC', '#B3C2FF'];
    

  return (
    <div className="animated-bg">
    {colors.map((color, i) => (
      <div
        key={i}
        className={`blob blob${i + 1}`}
        style={{ background: color }}
      />
    ))}
  </div>
  );
}
