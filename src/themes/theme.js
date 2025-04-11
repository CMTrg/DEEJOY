import { createTheme } from "@mui/material/styles"

export const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#007aff',
      },
      background: {
        default: '#8FD7FF',
        paper: '#ffffff',
      },
      
      text: {
        primary: '#000000',
      }
    },
    typography: {
        fontFamily: `'Outfit', sans-serif`,
        color: ''
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              fontFamily: 'Outfit',
              textTransform: 'none',
              width: '80px',
            },
          },
        },
      },
    customShadows: {
        innerPhonk: 'inset 0 0 150px 40px rgba(207, 46, 243, 0.12)',
      },
    customBackground: {
        mesh: true,
    }
  });
  
  export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#007aff',
      },
      background: {
        default: '#150158',
        paper: '#1e1e1e',
      },
      typography: {
        fontFamily: `'Outfit', sans-serif`,
      },
      text: {
        primary: '#FFFFFF',
      }
    },
   
    customBackground: {
        mesh: true,
    }
  });

