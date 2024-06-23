module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  mode: "jit",
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Poppins', 'sans-serif'],
      body: ['Poppins', 'sans-serif'],
    },
    extend: {
      fontSize: {
        14: '14px',
      },
      theme: {
        fontFamily: {
          display: ['Poppins', 'sans-serif'],
          body: ['Poppins', 'sans-serif'],
        },
        extend: {
          fontSize: {
            '14': '14px',
          },
          // ... other extended styles
    
          colors: {
            // ... existing colors
            'card-bg': '#1F2937', // Dark card background color
          },
          boxShadow: {
            'custom-light': '0 2px 4px rgba(0, 0, 0, 0.1)',
            'custom-dark': '5px 5px 15px rgba(0, 0, 0, 0.5)', // Custom shadow for dark theme
          }, 
          backgroundImage: theme => ({
            // ... existing background images
          }),
          keyframes: {
            scaleUp: {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
            },
          },
          animation: {
            'scale-up': 'scaleUp 0.5s ease-in-out infinite',
          },
        },
      },
      backgroundColor: {
        'primary': "#00040f",
        'main-bg': '#FAFBFB',
        'main-dark-bg': '#20232A',
        'secondary-dark-bg': '#33373E',
        'light-gray': '#F7F7F7',
        'second': '#252b36',
        'third' : '#49505c',
        'half-transparent': 'rgba(0, 0, 0, 0.5)',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
      backgroundImage: {
        'hero-pattern':
          "url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png')",
      },
    },
  },
  plugins: [],
};

