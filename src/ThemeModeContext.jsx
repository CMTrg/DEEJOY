import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useContext, createContext } from "react";

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
  const getSystemTheme = () => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  };

  const getInitialMode = () => {
    return localStorage.getItem("theme-mode") || "system";
  };

  const [mode, setMode] = useState(getInitialMode());

  const resolvedMode = mode === "system" ? getSystemTheme() : mode;

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode, resolvedMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}

export default function ThemeModeSelect() {
  const { mode, setMode } = useThemeMode();
  const [value, setValue] = useState(mode);

  useEffect(() => {
    setMode(value);
  }, [value, setMode]);

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel sx={{ color: (theme) => theme.palette.text.primary }}>
        Theme
      </InputLabel>
      <Select
        value={value}
        label="Theme"
        onChange={(e) => setValue(e.target.value)}
        sx={{
          color: (theme) => theme.palette.text.primary, // màu chữ
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.text.primary, // viền
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.primary.main, // hover viền
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: (theme) => theme.palette.primary.main, // khi focus
          },
        }}
      >
        <MenuItem value="light">Light</MenuItem>
        <MenuItem value="dark">Dark</MenuItem>
        <MenuItem value="system">System</MenuItem>
      </Select>
    </FormControl>
  );
}
