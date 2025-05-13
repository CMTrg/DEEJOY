import { createTheme } from "@mui/material/styles";
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#A2A8FF",
      text: "#4e4f50",
      texthover: '#ffffff'
    },
    secondary: {
        main: "rgba(223,163,255,50%)"
    },
    background: {
      default: "#8FD7FF",
      paper: "#ffffff",
    },
    blogbox: {
      main: "rgba(72,25,189,0.5)"
    },

    text: {
      primary: "#000000",
    },
  },
  typography: {
    fontFamily: `'Outfit', sans-serif`,
    color: "",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Outfit",
          textTransform: "none",
          width: "80px",
          fontSize: "1rem",
        },
      },
    },
    MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            overflowY: 'scroll', // ⚠️ Quan trọng: luôn giữ chỗ scrollbar
          },
          body: {
            transition: 'background-color 0.5s ease, color 0.5s ease',
            scrollbarGutter: 'stable', // giữ layout ổn định
      
            // Firefox
            scrollbarWidth: 'thin',
            scrollbarColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.3) transparent'
                : 'rgba(0,0,0,0.4) transparent',
          },
      
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.3)',
            borderRadius: '999px',
            transition: 'background-color 0.3s ease',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(0,0,0,0.6)',
          },
        }),
      },
  },

  customShadows: {
    innerPhonk: "inset 0 0 150px 40px rgba(207, 46, 243, 0.12)",
  },
  customBackground: {
    mesh: true,
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ec37ed",
      text: "#6B27F8",
      texthover: '#65676b'
    },
    secondary: {
        main: "#DFA3FF"
    },
    background: {
      default: "#150158",
      paper: "#1e1e1e",
    },
    typography: {
      fontFamily: `'Outfit', sans-serif`,
    },
    text: {
      primary: "#FFFFFF",
    },
    blogbox: {
      main: "rgba(72,25,189,0.5)"
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Outfit",
          textTransform: "none",
          minWidth: "75px",
          fontSize: "1rem",
        },
      },
    },

    MuiCssBaseline: {
        styleOverrides: (theme) => ({
          html: {
            overflowY: 'scroll', // ⚠️ Quan trọng: luôn giữ chỗ scrollbar
          },
          body: {
            transition: 'background-color 0.5s ease, color 0.5s ease',
            scrollbarGutter: 'stable', // giữ layout ổn định
      
            // Firefox
            scrollbarWidth: 'thin',
            scrollbarColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.3) transparent'
                : 'rgba(0,0,0,0.4) transparent',
          },
      
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.3)'
                : 'rgba(0,0,0,0.3)',
            borderRadius: '999px',
            transition: 'background-color 0.3s ease',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.5)'
                : 'rgba(0,0,0,0.6)',
          },
        }),
      },
  },

  customBackground: {
    mesh: true,
  },
});
